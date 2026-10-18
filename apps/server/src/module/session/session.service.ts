import { randomBytes } from "node:crypto";
import { Inject, Injectable } from "@nestjs/common";
import { InjectDrizzle } from "@nestjs/drizzle";
import {
	SessionData,
	SessionToken,
	sessionIdSchema,
} from "@repo/contract/module/session/entities";
import { UserId, userIdSchema } from "@repo/contract/shared/entities/user";
import { and, eq, ne, sql } from "drizzle-orm";
import { Redis } from "ioredis";
import { z } from "zod";
import { type Database } from "../../db/relations.js";
import { sessionsTable } from "../../db/schema.js";
import { REDIS_CLIENT } from "../../redis/redis.constants.js";
import { describeClient } from "../../shared/describeClient.js";
import { hashSessionToken } from "../../shared/hashSessionToken.js";
import { UaHeaders } from "../../shared/pickUaHeaders.js";
import { err, ok, Result } from "../../shared/result.js";
import { parseJson } from "../../shared/safe-json-parse.js";
import { GeoIpService } from "../geo-ip/geo-ip.service.js";
import { toSessionData } from "./session.mapper.js";

const LAST_ACTIVE_THROTTLE_SECONDS = 5 * 60;
const TTL_SECOND_REDIS_SESSION_TOKEN = 60 * 10;

type GetSessionResult = Result<{ session: SessionData }, { type: "NOT_FOUND" }>;

const validateSessionDataSchema = z.object({
	userId: userIdSchema,
	sessionId: sessionIdSchema,
});
type ValidateSessionData = z.infer<typeof validateSessionDataSchema>;
type ValidateSessionResult = Result<ValidateSessionData, { type: "NOT_FOUND" }>;

@Injectable()
export class SessionService {
	constructor(
		@Inject(REDIS_CLIENT) private readonly redis: Redis,
		@InjectDrizzle() private readonly db: Database,
		private readonly geoIpService: GeoIpService,
	) {}

	async validate(sessionTokenHash: string): Promise<ValidateSessionResult> {
		const value = await this.redis.get(this.redisSessionKey(sessionTokenHash));
		if (value) {
			if (value === "revoked") return err({ type: "NOT_FOUND" });
			const result = parseJson(value, validateSessionDataSchema);
			if (result.success) return ok(result.data);
		}

		const result = await this.db
			.select({ userId: sessionsTable.userId, sessionId: sessionsTable.id })
			.from(sessionsTable)
			.where(eq(sessionsTable.sessionToken, sessionTokenHash))
			.limit(1)
			.then((result) => result.at(0));
		if (!result) return err({ type: "NOT_FOUND" });

		const key = this.redisSessionKey(sessionTokenHash);
		const validateSessionData = {
			userId: result.userId,
			sessionId: result.sessionId,
		};
		await this.redis.set(
			key,
			JSON.stringify(validateSessionData),
			"EX",
			TTL_SECOND_REDIS_SESSION_TOKEN,
			"NX",
		);
		return ok(validateSessionData);
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
			.returning({ sessionToken: sessionsTable.sessionToken });

		if (sessions.length === 0) return;
		const data = sessions.flatMap((key) => [
			this.redisSessionKey(key.sessionToken),
			"revoked",
		]);
		await this.redis.msetex(
			sessions.length,
			...data,
			"EX",
			TTL_SECOND_REDIS_SESSION_TOKEN,
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
		await this.redis.set(
			this.redisSessionKey(session.sessionToken),
			"revoked",
			"EX",
			TTL_SECOND_REDIS_SESSION_TOKEN,
		);

		return ok({});
	}

	private redisSessionKey(sessionTokenHash: string) {
		return `session:${sessionTokenHash}`;
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
				sessionToken: sessionTokenHash,
				device: clientDescription.device,
				platform: clientDescription.platform,
				application: clientDescription.application,
				location: location,
			})
			.returning()
			.then((result) => result.at(0));
		if (!session) throw new Error("test error redis");

		const key = this.redisSessionKey(session.sessionToken);
		await this.redis.set(
			key,
			JSON.stringify({
				userId: session.userId,
				sessionId: session.id,
			}),
			"EX",
			TTL_SECOND_REDIS_SESSION_TOKEN,
		);

		return sessionToken;
	}

	private lastActiveKey(hashSessionToken: string) {
		return `session:active:${hashSessionToken}`;
	}
	async touch(hashSessionToken: string): Promise<void> {
		const acquired = await this.redis.set(
			this.lastActiveKey(hashSessionToken),
			"1",
			"EX",
			LAST_ACTIVE_THROTTLE_SECONDS,
			"NX",
		);
		if (acquired !== "OK") return;

		await this.db
			.update(sessionsTable)
			.set({ lastActiveDate: sql`now()` })
			.where(eq(sessionsTable.sessionToken, hashSessionToken));
	}
}
