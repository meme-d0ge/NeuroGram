import { z } from "zod";

export const userFirstNameSchema = z.string().min(1).max(64);
export type UserFirstName = z.infer<typeof userFirstNameSchema>;

export const userLastNameSchema = z.string().min(1).max(64).nullable();
export type UserLastName = z.infer<typeof userLastNameSchema>;
