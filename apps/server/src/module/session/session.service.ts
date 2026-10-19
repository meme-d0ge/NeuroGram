import { randomBytes } from "node:crypto";
import { Inject, Injectable } from "@nestjs/common";
import { InjectDrizzle } from "@nestjs/drizzle";
import {
	SessionData,
	SessionToken,
} from "@repo/contract/module/session/entities";
import { UserId } from "@repo/contract/shared/entities/user";
import { and, eq, ne, sql } from "drizzle-orm";
import { Redis } from "ioredis";
import { type Database } from "../../db/relations.js";
import { sessionsTable } from "../../db/schema.js";
import { REDIS_CLIENT } from "../../redis/redis.constants.js";
import { describeClient } from "../../shared/describeClient.js";
import { hashSessionToken } from "../../shared/hashSessionToken.js";
import { UaHeaders } from "../../shared/pickUaHeaders.js";
import { err, ok, Result } from "../../shared/result.js";
import { GeoIpService } from "../geo-ip/geo-ip.service.js";
import { SessionCache, ValidateSessionResult } from "./session.cache.js";
import { toSessionData } from "./session.mapper.js";

const LAST_ACTIVE_THROTTLE_SECONDS = 5 * 60;

type GetSessionResult = Result<{ session: SessionData }, { type: "NOT_FOUND" }>;

@Injectable()
export class SessionService {
	constructor(
		@Inject(REDIS_CLIENT) private readonly redis: Redis,
		@InjectDrizzle() private readonly db: Database,
		private readonly geoIpService: GeoIpService,
		private readonly sessionCache: SessionCache,
	) {}

	async validate(sessionTokenHash: string): Promise<ValidateSessionResult> {
		const result = await this.sessionCache.getSessionCache(sessionTokenHash);
		if (result.success) return result;

		const data = await this.db
			.select({ userId: sessionsTable.userId, sessionId: sessionsTable.id })
			.from(sessionsTable)
			.where(eq(sessionsTable.sessionTokenHash, sessionTokenHash))
			.limit(1)
			.then((result) => result.at(0));
		if (!data) return err({ type: "NOT_FOUND" });

		await this.sessionCache.updateSessionCache(
			sessionTokenHash,
			data.userId,
			data.sessionId,
		);

		return ok({
			userId: data.userId,
			sessionId: data.sessionId,
		});
	}

	async getSession(
		userId: UserId,
		sessionId: SessionData["id"],
	): Promise<GetSessionResult> {
		const session = await this.db
			.select()
			.from(sessionsTable)
			.where(
				and(eq(sessionsTable.id, sessionId), eq(sessionsTable.userId, userId)),
			)
			.limit(1)
			.then((result) => result.at(0));
		if (!session) return err({ type: "NOT_FOUND" });

		return ok({ session: toSessionData(session) });
	}

	async getAllSession(userId: UserId): Promise<SessionData[]> {
		const sessions = await this.db
			.select()
			.from(sessionsTable)
			.where(eq(sessionsTable.userId, userId));
		return sessions.map((session) => toSessionData(session));
	}

	async deleteOtherSessions(userId: UserId, keepSessionId: SessionData["id"]) {
		const sessions = await this.db
			.delete(sessionsTable)
			.where(
				and(
					eq(sessionsTable.userId, userId),
					ne(sessionsTable.id, keepSessionId),
				),
			)
			.returning({ sessionTokenHash: sessionsTable.sessionTokenHash });

		await this.sessionCache.revokeSessions(
			sessions.map((v) => v.sessionTokenHash),
		);
	}

	async deleteSessionById(
		userId: UserId,
		targetSessionId: SessionData["id"],
	): Promise<Result<object, object>> {
		const session = await this.db
			.delete(sessionsTable)
			.where(
				and(
					eq(sessionsTable.userId, userId),
					eq(sessionsTable.id, targetSessionId),
				),
			)
			.returning()
			.then((sessions) => sessions.at(0));
		if (!session) {
			return err({ type: "NOT_FOUND_SESSION" });
		}

		await this.sessionCache.revokeSession(session.sessionTokenHash);

		return ok({});
	}

	async createSession(
		userId: UserId,
		userIp: SessionData["ip"],
		uaHeaders: UaHeaders,
	): Promise<SessionToken> {
		const sessionToken = randomBytes(32).toString("hex");
		const sessionTokenHash = hashSessionToken(sessionToken);
		const clientDescription = describeClient(uaHeaders);

		const location = this.geoIpService.getLocationFromIp(userIp);
		const session = await this.db
			.insert(sessionsTable)
			.values({
				userId: userId,
				ip: userIp,
				sessionTokenHash: sessionTokenHash,
				device: clientDescription.device,
				platform: clientDescription.platform,
				application: clientDescription.application,
				location: location,
			})
			.returning({
				sessionTokenHash: sessionsTable.sessionTokenHash,
				sessionId: sessionsTable.id,
				userId: sessionsTable.userId,
			})
			.then((result) => result.at(0));
		if (!session) throw new Error("test error redis");

		await this.sessionCache.updateSessionCache(
			session.sessionTokenHash,
			session.userId,
			session.sessionId,
		);

		return sessionToken;
	}

	private lastActiveKey(hashSessionToken: string) {
		return `session:active:${hashSessionToken}`;
	}
	async touch(sessionTokenHash: string): Promise<void> {
		const acquired = await this.redis.set(
			this.lastActiveKey(sessionTokenHash),
			"1",
			"EX",
			LAST_ACTIVE_THROTTLE_SECONDS,
			"NX",
		);
		if (acquired !== "OK") return;

		await this.db
			.update(sessionsTable)
			.set({ lastActiveDate: sql`now()` })
			.where(eq(sessionsTable.sessionTokenHash, sessionTokenHash));
	}
}
