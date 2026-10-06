import { Controller } from "@nestjs/common";
import { Implement, implement } from "@orpc/nest";
import { setCookie } from "@orpc/server/helpers";
import { contract } from "@repo/contract";
import { AuthService } from "./auth.service.js";

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@Implement(contract.auth)
	auth() {
		return implement(contract.auth).router({
			sendCode: implement(contract.auth.sendCode).handler(
				async ({ input, errors }) => {
					const result = await this.authService.sendCode(input.phone);
					if (!result.success) {
						switch (result.error.type) {
							case "COOLDOWN":
								throw errors.OTP_COOLDOWN({
									data: {
										retryAfter: result.error.retryAfter,
									},
								});
						}
					}
					return { otpToken: result.data };
				},
			),
			signIn: implement(contract.auth.signIn).handler(
				async ({ input, errors, context }) => {
					const result = await this.authService.signIn(
						input.otpToken,
						input.otpCode,
					);
					if (!result.success) {
						switch (result.error.type) {
							case "INVALID_CODE":
								throw errors.INVALID_CODE({
									data: {
										attemptsLeft: result.error.attemptsLeft,
									},
								});
							case "EXPIRED":
								throw errors.UNAUTHORIZED();
						}
					}
					if (result.data.status === "authorized") {
						const { sessionId, ...data } = result.data;
						setCookie(context.resHeaders, "session", sessionId, {
							httpOnly: true,
							secure: true,
							sameSite: "lax",
							maxAge: 60 * 60 * 24 * 400,
						});
						return data;
					}

					return result.data;
				},
			),
			signUp: implement(contract.auth.signUp).handler(
				async ({ input, errors, context }) => {
					const result = await this.authService.signUp(
						input.signUpToken,
						input.firstName,
						input.lastName,
					);
					if (!result.success) {
						switch (result.error.type) {
							case "SIGN_UP_TOKEN_EXPIRED":
								throw errors.UNAUTHORIZED();
							case "USER_EXISTS":
								throw errors.CONFLICT();
						}
					}

					const { sessionId, ...data } = result.data;
					setCookie(context.resHeaders, "session", sessionId, {
						httpOnly: true,
						secure: true,
						sameSite: "lax",
						maxAge: 60 * 60 * 24 * 400,
					});

					return data;
				},
			),
		});
	}
}
