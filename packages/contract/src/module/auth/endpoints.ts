import { z } from "zod";
import { phoneSchema } from "../../shared/entities/phone.js";
import {
	userFirstNameSchema,
	userLastNameSchema,
} from "../../shared/entities/user.js";
import { baseProcedure } from "../../shared/procedures.js";
import { otpTokenSchema } from "../otp/entities.js";

export const login = baseProcedure
	.route({ method: "POST", path: "/auth/login" })
	.input(
		z.object({
			token: otpTokenSchema,
		}),
	)
	.output(
		z.object({
			phone: phoneSchema,
			firstName: userFirstNameSchema,
			lastName: userLastNameSchema,
		}),
	)
	.errors({
		UNAUTHORIZED: {},
		NOT_FOUND: {},
	});

export const register = baseProcedure
	.route({ method: "POST", path: "/auth/register" })
	.input(
		z.object({
			token: otpTokenSchema,
			firstName: userFirstNameSchema,
			lastName: userLastNameSchema,
		}),
	)
	.output(
		z.object({
			phone: phoneSchema,
			firstName: userFirstNameSchema,
			lastName: userLastNameSchema,
		}),
	)
	.errors({
		UNAUTHORIZED: {},
		CONFLICT: {},
	});
