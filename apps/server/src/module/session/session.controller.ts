import { Controller } from "@nestjs/common";
import { Implement, implement } from "@orpc/nest";
import { contract } from "@repo/contract";
import { sessionDataSchema } from "@repo/contract/module/session/entities";
import { AuthGuards } from "./auth.guards.js";

@Controller()
export class SessionController {
	constructor(private readonly authGuards: AuthGuards) {}

	@Implement(contract.session)
	session() {
		const authed = implement(contract.session).use(
			this.authGuards.authenticated,
		);
		return authed.router({
			getSession: authed.getSession.handler(() => {
				const session = sessionDataSchema.parse({
					id: "",
					ip: "",
					device: "",
					platform: "",
					application: "",
					location: "",
					login_date: new Date(),
					last_active_date: new Date(),
				});
				return {
					session: session,
				};
			}),
			getAllSession: authed.getAllSession.handler(() => {
				const session = sessionDataSchema.parse({
					id: "",
					ip: "",
					device: "",
					platform: "",
					application: "",
					location: "",
					login_date: new Date(),
					last_active_date: new Date(),
				});
				return {
					sessions: [session],
				};
			}),
			deleteSession: authed.deleteSession.handler(() => {}),
			deleteAllSession: authed.deleteAllSession.handler(() => {}),
		});
	}
}
