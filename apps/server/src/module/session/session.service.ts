import { createHash, randomBytes } from "node:crypto";
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
import { UaHeaders } from "../../shared/pickUaHeaders.js";

@Injectable()
export class SessionService {
	constructor(
		@Inject(REDIS_CLIENT) private readonly redis: Redis,
		@InjectDrizzle() private readonly db: Database,
	) {}
	private LAST_ACTIVE_THROTTLE_SECONDS = 5 * 60;
	private TTL_SECOND_REDIS_SESSION_TOKEN = 60 * 60;

	private redisSessionKey(sessionToken: string) {
		return `session:${sessionToken}`;
	}

	async createSession(
		userId: UserId,
		userIp: SessionData["ip"],
		uaHeaders: UaHeaders,
	): Promise<SessionToken> {
		const sessionToken = randomBytes(32).toString("hex");
		const hashSessionToken = createHash("sha256")
			.update(sessionToken, "utf-8")
			.digest("hex");

		const clientDescription = describeClient(uaHeaders);
		const key = this.redisSessionKey(hashSessionToken);
		await this.redis.set(
			key,
			userId,
			"EX",
			this.TTL_SECOND_REDIS_SESSION_TOKEN,
		);
		await this.db.insert(sessionsTable).values({
			userId: userId,
			ip: userIp,
			sessionToken: hashSessionToken,
			device: clientDescription.device,
			platform: clientDescription.platform,
			application: clientDescription.application,
			location: "Moscow Test", // TODO
		});
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
			this.LAST_ACTIVE_THROTTLE_SECONDS,
			"NX",
		);
		if (acquired !== "OK") return;

		await this.db
			.update(sessionsTable)
			.set({ lastActiveDate: sql`now()` })
			.where(eq(sessionsTable.sessionToken, hashSessionToken));
	}
}
