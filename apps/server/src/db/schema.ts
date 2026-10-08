import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm/_relations";
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

export const sessionsTable = pgTable("sessions", {
	id: uuid("id").primaryKey().default(sql`uuidv7()`),
	userId: uuid("user_id")
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),
	sessionToken: varchar("session_token").unique().notNull(),

	ip: varchar("ip"),
	device: varchar("device"),
	platform: varchar("platform"),
	application: varchar("application"),
	location: varchar("location"),

	createdAt: timestamp("created_at", {
		withTimezone: true,
	})
		.notNull()
		.defaultNow(),
	lastActiveDate: timestamp("last_active_date", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
	sessions: many(sessionsTable),
}));
export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [sessionsTable.userId],
		references: [usersTable.id],
	}),
}));
