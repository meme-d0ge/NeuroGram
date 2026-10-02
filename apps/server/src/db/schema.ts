import { sql } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	id: uuid("id").primaryKey().default(sql`uuidv7()`),
	phone: varchar("phone").notNull().unique("users_phone_unique"),
	firstName: varchar("first_name", { length: 64 }).notNull(),
	lastName: varchar("last_name", { length: 64 }),

	createdAt: timestamp("created_at", {
		withTimezone: true,
	})
		.notNull()
		.defaultNow(),

	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => sql`now()`),
});
