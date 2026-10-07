import { z } from "zod";

export const sessionIdSchema = z
	.string()
	.regex(/^[0-9A-Fa-f]+$/, "Invalid hex")
	.length(64);
export type SessionId = z.infer<typeof sessionIdSchema>;

export const sessionTokenSchema = z
	.string()
	.regex(/^[0-9A-Fa-f]+$/, "Invalid hex")
	.length(64);
export type SessionToken = z.infer<typeof sessionTokenSchema>;

export const SessionData = z.object({
	id: sessionIdSchema,
	ip: z.ipv4(),
	device: z.string(),
	platform: z.string(),
	application: z.string(),
	location: z.string(),
	login_date: z.date(),
	last_active_date: z.date(),
});
