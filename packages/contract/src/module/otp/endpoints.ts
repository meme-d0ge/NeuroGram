import {z} from 'zod';
import {baseProcedure} from "../../shared/procedures.js";
import {phoneSchema} from "../../shared/entities.js";
import {otpCodeSchema, otpTokenSchema, otpVerificationTokenSchema} from "./entities.js";

export const otpSendAuth = baseProcedure.input(z.object({
    phone: phoneSchema,
})).output(z.object({
    verificationToken: otpVerificationTokenSchema
}))

export const otpVerification = baseProcedure.input(z.object({
    verificationToken: otpVerificationTokenSchema,
    code: otpCodeSchema
})).output(z.object({
    token: otpTokenSchema
}))