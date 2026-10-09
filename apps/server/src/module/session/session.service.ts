import { randomBytes } from "node:crypto";
import { Inject, Injectable } from "@nestjs/common";
import { InjectDrizzle } from "@nestjs/drizzle";
import {
	SessionData,
	SessionToken,
} from "@repo/contract/module/session/entities";
import { UserId } from "@repo/contract/shared/entities/user";
import { eq, sql } from "drizzle-orm";
import { Redis } from "ioredis";
import { type Database } from "../../db/relations.js";
import { sessionsTable } from "../../db/schema.js";
import { REDIS_CLIENT } from "../../redis/redis.constants.js";
import { describeClient } from "../../shared/describeClient.js";
import { hashSessionToken } from "../../shared/hashSessionToken.js";
import { UaHeaders } from "../../shared/pickUaHeaders.js";
import { GeoIpService } from "../geo-ip/geo-ip.service.js";

const LAST_ACTIVE_THROTTLE_SECONDS = 5 * 60;
const TTL_SECOND_REDIS_SESSION_TOKEN = 60 * 60;

@Injectable()
export class SessionService {
	constructor(
		@Inject(REDIS_CLIENT) private readonly redis: Redis,
		@InjectDrizzle() private readonly db: Database,
		private readonly geoIpService: GeoIpService,
	) {}

	async validate(sessionTokenHash: string): Promise<null | string> {
		const value = await this.redis.get(this.redisSessionKey(sessionTokenHash));
		if (value) return value;

		const result = await this.db
			.select({ userId: sessionsTable.userId })
			.from(sessionsTable)
			.where(eq(sessionsTable.sessionToken, sessionTokenHash))
			.limit(1)
			.then((result) => result.at(0));
		if (!result) return null;

		const key = this.redisSessionKey(sessionTokenHash);
		await this.redis.set(
			key,
			result.userId,
			"EX",
			TTL_SECOND_REDIS_SESSION_TOKEN,
		);

		return result.userId;
	}

	private redisSessionKey(sessionToken: string) {
		return `session:${sessionToken}`;
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
		await this.db.insert(sessionsTable).values({
			userId: userId,
			ip: userIp,
			sessionToken: sessionTokenHash,
			device: clientDescription.device,
			platform: clientDescription.platform,
			application: clientDescription.application,
			location: location,
		});

		const key = this.redisSessionKey(sessionTokenHash);
		await this.redis.set(key, userId, "EX", TTL_SECOND_REDIS_SESSION_TOKEN);

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
