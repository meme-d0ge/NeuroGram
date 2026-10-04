import { randomBytes, randomInt } from "node:crypto";
import { Inject, Injectable } from "@nestjs/common";
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

export type OtpIssueError = { type: "COOLDOWN" };
export type OtpVerifyError =
	| { type: "INVALID_CODE"; attemptsLeft: number }
	| { type: "EXPIRED" }
	| { type: "TOO_MANY_ATTEMPTS" };

@Injectable()
export class OtpService {
	constructor(
		@Inject(REDIS_CLIENT) private readonly redis: Redis,
		private readonly smsProviderService: SmsProviderService,
	) {}

	private redisKey(token: string, name: OtpPurpose) {
		return `otp:${name}:${token}`;
	}

	async issue(
		purpose: OtpPurpose,
		phone: Phone,
	): Promise<Result<OtpToken, OtpIssueError>> {
		const code = String(randomInt(0, 10 ** OTP_CODE_LENGTH)).padStart(
			OTP_CODE_LENGTH,
			"0",
		);
		const token = randomBytes(32).toString("hex");
		await this.redis.set(
			this.redisKey(token, purpose),
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
		const key = this.redisKey(token, purpose);
		const data = await this.redis.get(key);
		if (data === null) return err({ type: "EXPIRED" });
		const result = parseJson(data, redisOtpDtoSchema);
		if (!result.success) {
			throw new Error(`corrupted OTP payload (purpose: ${purpose})`, {
				cause: result.error,
			});
		}
		if (result.data.code !== code)
			return err({ type: "INVALID_CODE", attemptsLeft: 10 }); //TODO
		if ((await this.redis.del(key)) === 0) return err({ type: "EXPIRED" });
		return ok(result.data.phone);
	}
}
