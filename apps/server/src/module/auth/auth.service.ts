import { randomBytes } from "node:crypto";
import { Inject, Injectable } from "@nestjs/common";
import { InjectDrizzle } from "@nestjs/drizzle";
import type { ContractInputs, ContractOutputs } from "@repo/contract";
import { phoneSchema } from "@repo/contract/shared/entities/phone";
import { eq } from "drizzle-orm";
import { Redis } from "ioredis";
import type { Database } from "../../db/relations.js";
import { usersTable } from "../../db/schema.js";
import { REDIS_CLIENT } from "../../redis/redis.constants.js";
import type { ContractErrors } from "../../shared/contract-errors.js";
import { OtpService } from "../otp/otp.service.js";
import { toSelfUser } from "../user/user.mapper.js";

const SIGN_UP_TOKEN_TTL_SECONDS = 900;

@Injectable()
export class AuthService {
	constructor(
		private readonly otpService: OtpService,
		@InjectDrizzle() private readonly db: Database,
		@Inject(REDIS_CLIENT) private readonly redis: Redis,
	) {}

	private redisSignUpKey(token: string): string {
		return `auth:signup:${token}`;
	}

	async sendCode(
		input: ContractInputs["auth"]["sendCode"],
		errors: ContractErrors["auth"]["sendCode"],
	): Promise<ContractOutputs["auth"]["sendCode"]> {
		const result = await this.otpService.issue("auth", input.phone);
		if (!result.success) {
			switch (result.error.type) {
				case "COOLDOWN":
					throw errors.TOO_MANY_REQUESTS();
			}
		}
		return {
			otpToken: result.data,
		};
	}

	async signIn(
		input: ContractInputs["auth"]["signIn"],
		errors: ContractErrors["auth"]["signIn"],
	): Promise<
		| (Extract<ContractOutputs["auth"]["signIn"], { status: "authorized" }> & {
				sessionId: string;
		  })
		| Extract<ContractOutputs["auth"]["signIn"], { status: "signUpRequired" }>
	> {
		const result = await this.otpService.verify(
			"auth",
			input.otpToken,
			input.otpCode,
		);
		if (!result.success) {
			switch (result.error.type) {
				case "INVALID_CODE":
					throw errors.UNAUTHORIZED();
				case "EXPIRED":
					throw errors.UNAUTHORIZED();
				case "TOO_MANY_ATTEMPTS":
					throw errors.TOO_MANY_REQUESTS();
			}
		}
		const [user] = await this.db
			.select()
			.from(usersTable)
			.where(eq(usersTable.phone, result.data));
		if (user === undefined) {
			const signUpToken = randomBytes(32).toString("hex");
			const key = this.redisSignUpKey(signUpToken);
			await this.redis.set(key, result.data, "EX", SIGN_UP_TOKEN_TTL_SECONDS);
			return {
				status: "signUpRequired",
				signUpToken: signUpToken,
			};
		}

		const selfUser = toSelfUser(user);
		return {
			status: "authorized",
			user: selfUser,
			sessionId: "test_sessionId",
		};
	}

	async signUp(
		input: ContractInputs["auth"]["signUp"],
		errors: ContractErrors["auth"]["signUp"],
	): Promise<ContractOutputs["auth"]["signUp"] & { sessionId: string }> {
		const value = await this.redis.getdel(
			this.redisSignUpKey(input.signUpToken),
		);
		if (value === null) throw errors.UNAUTHORIZED();
		const phone = phoneSchema.parse(value);

		const newUserValues = {
			phone: phone,
			firstName: input.firstName,
			lastName: input.lastName,
		};
		const [created] = await this.db
			.insert(usersTable)
			.values(newUserValues)
			.onConflictDoNothing({ target: usersTable.phone })
			.returning();
		if (created === undefined) throw errors.CONFLICT();

		const newUser = toSelfUser(created);
		return {
			user: newUser,
			sessionId: "test_sessionId",
		};
	}
}
