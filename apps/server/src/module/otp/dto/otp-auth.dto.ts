import { otpCodeSchema } from "@repo/contract/module/otp/entities";
import { phoneSchema } from "@repo/contract/shared/entities";
import { z } from "zod";

export const redisOtpAuthDtoSchema = z.object({
	code: otpCodeSchema,
	phone: phoneSchema,
});
