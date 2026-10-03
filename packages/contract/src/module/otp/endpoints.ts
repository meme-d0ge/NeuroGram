import { z } from "zod";
import { phoneSchema } from "../../shared/entities/phone.js";
import { baseProcedure } from "../../shared/procedures.js";
import {
	authNextStepSchema,
	otpCodeSchema,
	otpTokenSchema,
	otpVerificationTokenSchema,
} from "./entities.js";

export const sendAuth = baseProcedure
	.route({ method: "POST", path: "/otp/send-auth" })
	.input(
		z.object({
			phone: phoneSchema,
		}),
	)
	.output(
		z.object({
			verificationToken: otpVerificationTokenSchema,
		}),
	);

export const verifyAuth = baseProcedure
	.route({ method: "POST", path: "/otp/verify-auth" })
	.input(
		z.object({
			verificationToken: otpVerificationTokenSchema,
			code: otpCodeSchema,
		}),
	)
	.output(
		z.object({
			token: otpTokenSchema,
			nextStep: authNextStepSchema,
		}),
	)
	.errors({
		UNAUTHORIZED: {},
	});
