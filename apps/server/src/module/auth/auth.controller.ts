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
				async ({ input, errors }) =>
					await this.authService.sendCode(input, errors),
			),
			signIn: implement(contract.auth.signIn).handler(
				async ({ input, errors, context }) => {
					const result = await this.authService.signIn(input, errors);
					if (result.status === "authorized") {
						const { sessionId, ...data } = result;
						setCookie(context.resHeaders, "session", sessionId, {
							httpOnly: true,
							secure: true,
							sameSite: "lax",
							maxAge: 60 * 60 * 24 * 400,
						});
						return data;
					}

					return result;
				},
			),
			signUp: implement(contract.auth.signUp).handler(
				async ({ input, errors, context }) => {
					const { sessionId, ...data } = await this.authService.signUp(
						input,
						errors,
					);
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
