import { otpCodeSchema } from "@repo/contract/module/otp/entities";
import { phoneSchema } from "@repo/contract/shared/entities/phone";
import { z } from "zod";

export const redisOtpDtoSchema = z.object({
	code: otpCodeSchema,
	phone: phoneSchema,
});
export type RedisOtpDto = z.infer<typeof redisOtpDtoSchema>;
