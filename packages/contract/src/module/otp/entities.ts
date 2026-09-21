import { z } from "zod";

export const otpVerificationTokenSchema = z.string({});
export type otpVerificationToken = z.infer<typeof otpVerificationTokenSchema>;

export const otpCodeSchema = z.number().min(100000).max(999999);
export type OtpCode = z.infer<typeof otpCodeSchema>;

export const otpTokenSchema = z.string();
export type OtpToken = z.infer<typeof otpTokenSchema>;
