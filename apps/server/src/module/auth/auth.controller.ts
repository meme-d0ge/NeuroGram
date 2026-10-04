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
			login: implement(contract.auth.login).handler(
				async ({ input, errors, context }) => {
					const { sessionId, ...user } = await this.authService.login(
						input,
						errors,
					);
					setCookie(context.resHeaders, "session", sessionId, {
						httpOnly: true,
						secure: true,
						sameSite: "lax",
						maxAge: 60 * 60 * 24 * 400,
					});

					return user;
				},
			),
			register: implement(contract.auth.register).handler(
				async ({ input, errors, context }) => {
					const { sessionId, ...user } = await this.authService.register(
						input,
						errors,
					);
					setCookie(context.resHeaders, "session", sessionId, {
						httpOnly: true,
						secure: true,
						sameSite: "lax",
						maxAge: 60 * 60 * 24 * 400,
					});

					return user;
				},
			),
		});
	}
}
