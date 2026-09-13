import {z} from 'zod';

export const otpVerificationTokenSchema = z.string({})
export const otpCodeSchema = z.number().min(100000).max(999999)
export const otpTokenSchema = z.string()