import { z } from "zod";
import { phoneSchema } from "./phone.js";

export const userIdSchema = z.uuid();
export type UserId = z.infer<typeof userIdSchema>;

export const userFirstNameSchema = z.string().min(1).max(64);
export type UserFirstName = z.infer<typeof userFirstNameSchema>;

export const userLastNameSchema = z.string().min(1).max(64).nullable();
export type UserLastName = z.infer<typeof userLastNameSchema>;

export const selfUserSchema = z.object({
	id: userIdSchema,
	phone: phoneSchema,
	firstName: userFirstNameSchema,
	lastName: userLastNameSchema,
});
export type SelfUser = z.infer<typeof selfUserSchema>;
