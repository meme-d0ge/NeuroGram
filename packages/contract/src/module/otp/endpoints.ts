import { z } from "zod";
import { phoneSchema } from "../../shared/entities.js";
import { baseProcedure } from "../../shared/procedures.js";
import {
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

export const verify = baseProcedure
	.route({ method: "POST", path: "/otp/verify" })
	.input(
		z.object({
			verificationToken: otpVerificationTokenSchema,
			code: otpCodeSchema,
		}),
	)
	.output(
		z.object({
			token: otpTokenSchema,
		}),
	);
