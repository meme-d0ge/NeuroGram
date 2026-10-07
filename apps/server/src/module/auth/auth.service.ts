import { randomBytes } from "node:crypto";
import { Inject, Injectable } from "@nestjs/common";
import { InjectDrizzle } from "@nestjs/drizzle";
import { SignUpToken } from "@repo/contract/module/auth/entities";
import { OtpCode, OtpToken } from "@repo/contract/module/otp/entities";
import { SessionToken } from "@repo/contract/module/session/entities";
import { Phone, phoneSchema } from "@repo/contract/shared/entities/phone";
import {
	SelfUser,
	UserFirstName,
	UserLastName,
} from "@repo/contract/shared/entities/user";
import { eq } from "drizzle-orm";
import { Redis } from "ioredis";
import type { Database } from "../../db/relations.js";
import { usersTable } from "../../db/schema.js";
import { REDIS_CLIENT } from "../../redis/redis.constants.js";
import { err, ok, Result } from "../../shared/result.js";
import {
	OtpIssueError,
	OtpService,
	OtpVerifyError,
} from "../otp/otp.service.js";
import { toSelfUser } from "../user/user.mapper.js";

const SIGN_UP_TOKEN_TTL_SECONDS = 900;

export type SignInResult =
	| { status: "authorized"; user: SelfUser; sessionToken: SessionToken }
	| { status: "signUpRequired"; signUpToken: SignUpToken };

export type SignUpResult = { user: SelfUser; sessionToken: SessionToken };
export type SignUpError =
	| { type: "SIGN_UP_TOKEN_EXPIRED" }
	| { type: "USER_EXISTS" };

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

	async sendCode(phone: Phone): Promise<Result<OtpToken, OtpIssueError>> {
		return this.otpService.issue("auth", phone);
	}

	async signIn(
		otpToken: OtpToken,
		otpCode: OtpCode,
	): Promise<Result<SignInResult, OtpVerifyError>> {
		const result = await this.otpService.verify("auth", otpToken, otpCode);
		if (!result.success) return err(result.error);
		const user = await this.db
			.select()
			.from(usersTable)
			.where(eq(usersTable.phone, result.data))
			.then((res) => res.at(0));
		if (user === undefined) {
			const signUpToken = randomBytes(32).toString("hex");
			const key = this.redisSignUpKey(signUpToken);
			await this.redis.set(key, result.data, "EX", SIGN_UP_TOKEN_TTL_SECONDS);
			return ok({
				status: "signUpRequired",
				signUpToken: signUpToken,
			});
		}

		return ok({
			status: "authorized",
			user: toSelfUser(user),
			sessionToken: "test_session_token",
		});
	}

	async signUp(
		signUpToken: SignUpToken,
		firstName: UserFirstName,
		lastName: UserLastName,
	): Promise<Result<SignUpResult, SignUpError>> {
		const value = await this.redis.getdel(this.redisSignUpKey(signUpToken));
		if (value === null) return err({ type: "SIGN_UP_TOKEN_EXPIRED" });
		const phone = phoneSchema.parse(value);

		const newUserValues = {
			phone: phone,
			firstName: firstName,
			lastName: lastName,
		};
		const created = await this.db
			.insert(usersTable)
			.values(newUserValues)
			.onConflictDoNothing({ target: usersTable.phone })
			.returning()
			.then((res) => res.at(0));
		if (created === undefined) return err({ type: "USER_EXISTS" });

		const newUser = toSelfUser(created);
		return ok({
			user: newUser,
			sessionToken: "test_session_token",
		});
	}
}
