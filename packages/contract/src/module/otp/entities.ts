import { z } from "zod";

export const otpVerificationTokenSchema = z
	.string()
	.regex(/^[0-9A-Fa-f]+$/, "Invalid hex");
export type otpVerificationToken = z.infer<typeof otpVerificationTokenSchema>;

export const OTP_CODE_LENGTH = 6;
export const otpCodeSchema = z
	.string()
	.length(
		OTP_CODE_LENGTH,
		`Code must contain exactly ${OTP_CODE_LENGTH} digits`,
	)
	.regex(/^[0-9]+$/, "Only digits are allowed");
export type OtpCode = z.infer<typeof otpCodeSchema>;

export const otpTokenSchema = z.string().regex(/^[0-9A-Fa-f]+$/, "Invalid hex");
export type OtpToken = z.infer<typeof otpTokenSchema>;

export const authNextStepSchema = z.enum(["login", "register"]);
export type AuthNextStep = z.infer<typeof authNextStepSchema>;
