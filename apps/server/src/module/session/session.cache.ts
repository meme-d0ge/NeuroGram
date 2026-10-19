import { Inject, Injectable, Logger } from "@nestjs/common";
import {
	SessionId,
	sessionIdSchema,
} from "@repo/contract/module/session/entities";
import { UserId, userIdSchema } from "@repo/contract/shared/entities/user";
import { Redis } from "ioredis";
import { z } from "zod";
import { REDIS_CLIENT } from "../../redis/redis.constants.js";
import { err, ok, Result } from "../../shared/result.js";
import { parseJson } from "../../shared/safe-json-parse.js";

const TTL_SECOND_REDIS_SESSION_TOKEN = 60 * 10;

// type
const validateSessionDataSchema = z.object({
	userId: userIdSchema,
	sessionId: sessionIdSchema,
});

type ValidateSessionOk = z.infer<typeof validateSessionDataSchema>;
type ValidateSessionErr = { type: "NOT_FOUND" } | { type: "REVOKE" };
export type ValidateSessionResult = Result<
	ValidateSessionOk,
	ValidateSessionErr
>;

const REVOKE_STATUS_VALUE = "revoke";

@Injectable()
export class SessionCache {
	private logger = new Logger(SessionCache.name);
	constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}
	private redisSessionKey(sessionTokenHash: string) {
		return `session:${sessionTokenHash}`;
	}

	async getSessionCache(
		sessionTokenHash: string,
	): Promise<ValidateSessionResult> {
		const value = await this.redis.get(this.redisSessionKey(sessionTokenHash));
		if (!value) return err({ type: "NOT_FOUND" });
		if (value === REVOKE_STATUS_VALUE) return err({ type: "REVOKE" });

		const result = parseJson(value, validateSessionDataSchema);
		if (result.success) return ok(result.data);

		this.logger.error(
			"REDIS SESSION.CACHE.TS ERROR PARSE JSON DATA FROM CACHE",
		);
		return err({ type: "NOT_FOUND" });
	}

	async updateSessionCache(
		sessionTokenHash: string,
		userId: UserId,
		sessionId: SessionId,
	) {
		const key = this.redisSessionKey(sessionTokenHash);
		await this.redis.set(
			key,
			JSON.stringify({
				userId: userId,
				sessionId: sessionId,
			}),
			"EX",
			TTL_SECOND_REDIS_SESSION_TOKEN,
			"NX",
		);
	}

	async revokeSession(sessionTokenHash: string) {
		await this.redis.set(
			this.redisSessionKey(sessionTokenHash),
			REVOKE_STATUS_VALUE,
			"EX",
			TTL_SECOND_REDIS_SESSION_TOKEN,
		);
	}

	async revokeSessions(sessionsTokenHash: string[]) {
		if (sessionsTokenHash.length === 0) return;

		const data = sessionsTokenHash.flatMap((sessionTokenHash) => [
			this.redisSessionKey(sessionTokenHash),
			REVOKE_STATUS_VALUE,
		]);

		await this.redis.msetex(
			sessionsTokenHash.length,
			...data,
			"EX",
			TTL_SECOND_REDIS_SESSION_TOKEN,
		);
	}
}
