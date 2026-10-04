import { z } from "zod";
export const signUpTokenSchema = z
	.string()
	.regex(/^[0-9A-Fa-f]+$/, "Invalid hex")
	.length(64);
export type SignUpToken = z.infer<typeof signUpTokenSchema>;
