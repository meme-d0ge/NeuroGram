import { randomBytes, randomInt } from "node:crypto";
import { Inject, Injectable } from "@nestjs/common";
import type { ContractInputs, ContractOutputs } from "@repo/contract";
import { OTP_CODE_LENGTH } from "@repo/contract/module/otp/entities";
import { Redis } from "ioredis";
import { REDIS_CLIENT } from "../../redis/redis.constants.js";
import type { ContractErrors } from "../../shared/contract-errors.js";
import { parseJson } from "../../shared/safe-json-parse.js";
import { SmsProviderService } from "../sms-provider/sms-provider.service.js";
import { redisOtpAuthDtoSchema } from "./dto/otp-auth.dto.js";

@Injectable()
export class OtpService {
	constructor(
		@Inject(REDIS_CLIENT) private readonly redis: Redis,
		private readonly SmsProviderService: SmsProviderService,
	) {}

	private redisAuthKey(token: string) {
		return `otp:auth:verify:${token}`;
	}
	async sendAuth(
		input: ContractInputs["otp"]["sendAuth"],
		_errors: ContractErrors["otp"]["sendAuth"],
	): Promise<ContractOutputs["otp"]["sendAuth"]> {
		const code = String(randomInt(0, 10 ** OTP_CODE_LENGTH)).padStart(
			OTP_CODE_LENGTH,
			"0",
		);

		this.SmsProviderService.sendMessage(
			`Your Neurogram authentication code is: ${code}`,
			input.phone,
		);

		const verificationToken = randomBytes(32).toString("hex");
		const payload = JSON.stringify({
			code: code,
			phone: input.phone,
		});
		await this.redis.set(
			this.redisAuthKey(verificationToken),
			payload,
			"EX",
			300,
		);

		return { verificationToken: verificationToken };
	}
	async verifyAuth(
		input: ContractInputs["otp"]["verifyAuth"],
		errors: ContractErrors["otp"]["verifyAuth"],
	): Promise<ContractOutputs["otp"]["verifyAuth"]> {
		const key = this.redisAuthKey(input.verificationToken);

		const raw = await this.redis.get(key);
		if (raw === null) throw errors.UNAUTHORIZED();

		const payload = parseJson(raw, redisOtpAuthDtoSchema);
		if (!payload.success) {
			throw new Error(`corrupted OTP payload: ${payload.error.message}`, {
				cause: payload.error,
			});
		}

		if (input.code !== payload.data.code) throw errors.UNAUTHORIZED();
		if ((await this.redis.del(key)) === 0) throw errors.UNAUTHORIZED();

		const token = randomBytes(32).toString("hex");
		await this.redis.set(
			`otp:auth:access:${token}`,
			payload.data.phone,
			"EX",
			900,
		);
		return { token };
	}
}
