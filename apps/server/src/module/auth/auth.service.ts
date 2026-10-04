import { Injectable } from "@nestjs/common";
import { InjectDrizzle } from "@nestjs/drizzle";
import type { ContractInputs, ContractOutputs } from "@repo/contract";
import { Phone } from "@repo/contract/shared/entities/phone";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { usersTable } from "../../db/schema.js";
import type { ContractErrors } from "../../shared/contract-errors.js";
import { OtpService } from "../otp/otp.service.js";
import { toSelfUser } from "../user/user.mapper.js";

@Injectable()
export class AuthService {
	constructor(
		private readonly otpService: OtpService,
		@InjectDrizzle()
		private readonly db: NodePgDatabase,
	) {}
	async login(
		input: ContractInputs["auth"]["login"],
		errors: ContractErrors["auth"]["login"],
	): Promise<ContractOutputs["auth"]["login"] & { sessionId: string }> {
		const phone: Phone | null = await this.otpService.consumeAuthToken(
			input.token,
		);
		if (phone === null) throw errors.UNAUTHORIZED();
		const [user] = await this.db
			.select()
			.from(usersTable)
			.where(eq(usersTable.phone, phone));
		if (user === undefined) throw errors.NOT_FOUND();

		const selfUser = toSelfUser(user);
		return {
			...selfUser,
			sessionId: "test_sessionId",
		};
	}
	async register(
		input: ContractInputs["auth"]["register"],
		errors: ContractErrors["auth"]["register"],
	): Promise<ContractOutputs["auth"]["register"] & { sessionId: string }> {
		const phone: Phone | null = await this.otpService.consumeAuthToken(
			input.token,
		);
		if (phone === null) throw errors.UNAUTHORIZED();

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
			...newUser,
			sessionId: "test_sessionId",
		};
	}
}
