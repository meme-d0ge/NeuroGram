import { randomBytes, randomInt } from "node:crypto";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import {
	OTP_CODE_LENGTH,
	OtpCode,
	OtpToken,
} from "@repo/contract/module/otp/entities";
import { Phone } from "@repo/contract/shared/entities/phone";
import { Redis } from "ioredis";
import { REDIS_CLIENT } from "../../redis/redis.constants.js";
import { err, ok, Result } from "../../shared/result.js";
import { parseJson } from "../../shared/safe-json-parse.js";
import { SmsProviderService } from "../sms-provider/sms-provider.service.js";
import { redisOtpDtoSchema } from "./dto/otp.dto.js";
import { OTP_PURPOSES, OtpPurpose } from "./otp.purposes.js";
import { otpScripts } from "./otp.scripts.js";

export type OtpIssueError = { type: "COOLDOWN"; retryAfter: number };
export type OtpVerifyError =
	| { type: "INVALID_CODE"; attemptsLeft: number }
	| { type: "ATTEMPTS_EXCEEDED" }
	| { type: "EXPIRED" };
@Injectable()
export class OtpService implements OnModuleInit {
	constructor(
		@Inject(REDIS_CLIENT) private readonly redis: Redis,
		private readonly smsProviderService: SmsProviderService,
	) {}

	onModuleInit() {
		for (const [name, definition] of Object.entries(otpScripts)) {
			this.redis.defineCommand(name, definition);
		}
	}

	private redisTokenKey(token: string, name: OtpPurpose) {
		return `otp:token:${name}:${token}`;
	}

	private redisIssueCooldownKey(token: string, name: OtpPurpose) {
		return `otp:issue:${name}:${token}`;
	}

	private redisVerifyAttemptsKey(token: string, name: OtpPurpose) {
		return `otp:attempts:${name}:${token}`;
	}

	async issue(
		purpose: OtpPurpose,
		phone: Phone,
	): Promise<Result<OtpToken, OtpIssueError>> {
		const [status, ttl] = await this.redis.cooldown(
			this.redisIssueCooldownKey(phone, purpose),
			OTP_PURPOSES[purpose].cooldownSeconds,
		);
		if (status === "EXISTED") return err({ type: "COOLDOWN", retryAfter: ttl });

		const code = String(randomInt(0, 10 ** OTP_CODE_LENGTH)).padStart(
			OTP_CODE_LENGTH,
			"0",
		);
		const token = randomBytes(32).toString("hex");
		await this.redis.set(
			this.redisTokenKey(token, purpose),
			JSON.stringify({
				phone: phone,
				code: code,
			}),
			"EX",
			OTP_PURPOSES[purpose].ttlSeconds,
		);
		await this.smsProviderService.sendMessage(
			OTP_PURPOSES[purpose].message(code),
			phone,
		);
		return ok(token);
	}
	async verify(
		purpose: OtpPurpose,
		token: OtpToken,
		code: OtpCode,
	): Promise<Result<Phone, OtpVerifyError>> {
		const tokenKey = this.redisTokenKey(token, purpose);
		const data = await this.redis.get(tokenKey);
		if (data === null) return err({ type: "EXPIRED" });

		const attemptsKey = this.redisVerifyAttemptsKey(token, purpose);
		const results = await this.redis
			.multi()
			.incr(attemptsKey)
			.expire(attemptsKey, OTP_PURPOSES[purpose].ttlSeconds)
			.exec();

		if (!results) {
			throw new Error("Redis transaction aborted");
		}

		const [[incrErr, attempts]] = results;
		if (incrErr) throw incrErr;
		const attemptCount = attempts as number;

		if (attemptCount > OTP_PURPOSES[purpose].maxAttempts) {
			await this.redis.del(tokenKey, attemptsKey);
			return err({ type: "EXPIRED" });
		}

		const result = parseJson(data, redisOtpDtoSchema);
		if (!result.success) {
			throw new Error(`corrupted OTP payload (purpose: ${purpose})`, {
				cause: result.error,
			});
		}
		if (result.data.code !== code)
			if (OTP_PURPOSES[purpose].maxAttempts - attemptCount > 0) {
				return err({
					type: "INVALID_CODE",
					attemptsLeft: OTP_PURPOSES[purpose].maxAttempts - attemptCount,
				});
			} else {
				return err({
					type: "ATTEMPTS_EXCEEDED",
				});
			}
		if ((await this.redis.del(tokenKey)) === 0) return err({ type: "EXPIRED" });
		return ok(result.data.phone);
	}
}
