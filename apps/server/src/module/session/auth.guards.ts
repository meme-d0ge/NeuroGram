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
			const sessionTokenHash = context.sessionTokenHash;
			if (!sessionTokenHash) throw new ORPCError("UNAUTHORIZED");

			const userId = await this.sessionService.validate(sessionTokenHash);
			if (!userId) throw new ORPCError("UNAUTHORIZED");
			await this.sessionService.touch(sessionTokenHash);
			return next({
				context: { userId },
			});
		});
}
