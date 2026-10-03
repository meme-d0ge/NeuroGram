import { randomBytes, randomInt } from "node:crypto";
import { Inject, Injectable } from "@nestjs/common";
import { InjectDrizzle } from "@nestjs/drizzle";
import type { ContractInputs, ContractOutputs } from "@repo/contract";
import {
	AuthNextStep,
	OTP_CODE_LENGTH,
} from "@repo/contract/module/otp/entities";
import { Phone, phoneSchema } from "@repo/contract/shared/entities/phone";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Redis } from "ioredis";
import { usersTable } from "../../db/schema.js";
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
		@InjectDrizzle()
		private readonly db: NodePgDatabase,
	) {}

	private redisAuthVerifyKey(token: string) {
		return `otp:auth:verify:${token}`;
	}

	private redisAuthAccess(token: string) {
		return `otp:auth:access:${token}`;
	}
	async sendAuth(
		input: ContractInputs["otp"]["sendAuth"],
		_errors: ContractErrors["otp"]["sendAuth"],
	): Promise<ContractOutputs["otp"]["sendAuth"]> {
		const code = String(randomInt(0, 10 ** OTP_CODE_LENGTH)).padStart(
			OTP_CODE_LENGTH,
			"0",
		);

		const verificationToken = randomBytes(32).toString("hex");
		const payload = JSON.stringify({
			code: code,
			phone: input.phone,
		});
		await this.redis.set(
			this.redisAuthVerifyKey(verificationToken),
			payload,
			"EX",
			300,
		);
		await this.SmsProviderService.sendMessage(
			`Your Neurogram authentication code is: ${code}`,
			input.phone,
		);

		return { verificationToken: verificationToken };
	}
	async verifyAuth(
		input: ContractInputs["otp"]["verifyAuth"],
		errors: ContractErrors["otp"]["verifyAuth"],
	): Promise<ContractOutputs["otp"]["verifyAuth"]> {
		const key = this.redisAuthVerifyKey(input.verificationToken);

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
			this.redisAuthAccess(token),
			payload.data.phone,
			"EX",
			900,
		);

		let nextStep: AuthNextStep = "login";
		const [user] = await this.db
			.select({
				id: usersTable.id,
			})
			.from(usersTable)
			.where(eq(usersTable.phone, payload.data.phone));
		if (user === undefined) nextStep = "register";

		return { token, nextStep };
	}

	async consumeAuthToken(token: string): Promise<Phone | null> {
		const raw = await this.redis.getdel(this.redisAuthAccess(token));
		if (raw === null) return null;

		const phone = phoneSchema.safeParse(raw);
		if (!phone.success) {
			throw new Error(`corrupted auth token payload: ${phone.error.message}`, {
				cause: phone.error,
			});
		}
		return phone.data;
	}
}
