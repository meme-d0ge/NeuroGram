import { SelfUser } from "@repo/contract/shared/entities/user";
import { usersTable } from "../../db/schema.js";

export function toSelfUser(row: typeof usersTable.$inferSelect): SelfUser {
	return {
		id: row.id,
		phone: row.phone,
		firstName: row.firstName,
		lastName: row.lastName,
	};
}
