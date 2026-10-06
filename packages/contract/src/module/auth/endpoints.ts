import { z } from "zod";
import { phoneSchema } from "../../shared/entities/phone.js";
import {
	selfUserSchema,
	userFirstNameSchema,
	userLastNameSchema,
} from "../../shared/entities/user.js";
import { baseProcedure } from "../../shared/procedures.js";
import { otpCodeSchema, otpTokenSchema } from "../otp/entities.js";
import { signUpTokenSchema } from "./entities.js";

export const sendCode = baseProcedure
	.route({ method: "POST", path: "/auth/send-code" })
	.input(
		z.object({
			phone: phoneSchema,
		}),
	)
	.output(
		z.object({
			otpToken: otpTokenSchema,
		}),
	)
	.errors({
		OTP_COOLDOWN: {
			data: z.object({
				retryAfter: z.number(),
			}),
			status: 429,
		},
	});

export const signIn = baseProcedure
	.route({ method: "POST", path: "/auth/sign-in" })
	.input(
		z.object({
			otpToken: otpTokenSchema,
			otpCode: otpCodeSchema,
		}),
	)
	.output(
		z.discriminatedUnion("status", [
			z.object({
				status: z.literal("authorized"),
				user: selfUserSchema,
			}),
			z.object({
				status: z.literal("signUpRequired"),
				signUpToken: signUpTokenSchema,
			}),
		]),
	)
	.errors({
		INVALID_CODE: {
			data: z.object({
				attemptsLeft: z.number(),
			}),
			status: 400,
		},
		UNAUTHORIZED: {},
	});

export const signUp = baseProcedure
	.route({ method: "POST", path: "/auth/sign-up" })
	.input(
		z.object({
			signUpToken: signUpTokenSchema,
			firstName: userFirstNameSchema,
			lastName: userLastNameSchema,
		}),
	)
	.output(
		z.object({
			user: selfUserSchema,
		}),
	)
	.errors({
		UNAUTHORIZED: {},
		CONFLICT: {},
	});
