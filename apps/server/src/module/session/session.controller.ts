import { Controller } from "@nestjs/common";
import { Implement, implement } from "@orpc/nest";
import { contract } from "@repo/contract";
import { sessionDataSchema } from "@repo/contract/module/session/entities";

@Controller("session")
export class SessionController {
	@Implement(contract.session)
	auth() {
		return implement(contract.session).router({
			getSession: implement(contract.session.getSession).handler(() => {
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
			getAllSession: implement(contract.session.getAllSession).handler(() => {
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
			deleteSession: implement(contract.session.deleteSession).handler(
				() => {},
			),
			deleteAllSession: implement(contract.session.deleteAllSession).handler(
				() => {},
			),
		});
	}
}
