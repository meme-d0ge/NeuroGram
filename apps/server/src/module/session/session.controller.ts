import { Controller } from "@nestjs/common";
import { Implement, implement } from "@orpc/nest";
import { contract } from "@repo/contract";
import { AuthGuards } from "./auth.guards.js";
import { SessionService } from "./session.service.js";

@Controller()
export class SessionController {
	constructor(
		private readonly authGuards: AuthGuards,
		private readonly sessionService: SessionService,
	) {}

	@Implement(contract.session)
	session() {
		const authed = implement(contract.session).use(
			this.authGuards.authenticated,
		);
		return authed.router({
			getSession: authed.getSession.handler(
				async ({ errors, context, input }) => {
					const result = await this.sessionService.getSession(
						context.userId,
						input.id,
					);
					if (!result.success) {
						switch (result.error.type) {
							case "NOT_FOUND":
								throw errors.NOT_FOUND_SESSION();
						}
					}
					return {
						session: result.data.session,
					};
				},
			),
			getAllSession: authed.getAllSession.handler(async ({ context }) => {
				const sessions = await this.sessionService.getAllSession(
					context.userId,
				);
				return {
					sessions: sessions,
				};
			}),
			deleteSession: authed.deleteSession.handler(
				async ({ errors, context, input }) => {
					if (context.sessionId === input.id)
						throw errors.CANNOT_DELETE_CURRENT_SESSION();
					await this.sessionService.deleteSessionById(context.userId, input.id);
				},
			),
			deleteAllSession: authed.deleteAllSession.handler(async ({ context }) => {
				await this.sessionService.deleteOtherSessions(
					context.userId,
					context.sessionId,
				);
			}),
		});
	}
}
