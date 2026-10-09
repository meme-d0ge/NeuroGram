import { Injectable } from "@nestjs/common";
import { ORPCError, ORPCGlobalContext } from "@orpc/nest";
import { os } from "@orpc/server";
import { SessionService } from "./session.service.js";

@Injectable()
export class AuthGuards {
	constructor(private readonly sessionService: SessionService) {}

	readonly authenticated = os
		.$context<ORPCGlobalContext>()
		.middleware(async ({ context, next }) => {
			const hashToken = context.sessionTokenHash;
			const userId = hashToken
				? await this.sessionService.validate(hashToken)
				: null;
			if (!userId) throw new ORPCError("UNAUTHORIZED");
			return next({
				context: { userId },
			});
		});
}
