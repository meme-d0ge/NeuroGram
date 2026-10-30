import {
	isValidPhoneNumber,
	parsePhoneNumberWithError,
} from "libphonenumber-js";
import { z } from "zod";
import { countryCodeSchema } from "@/entities/country";

export const PhoneFormErrorCode = {
	PHONE_REQUIRED: "PHONE_REQUIRED",
	PHONE_INVALID: "PHONE_INVALID",
	UNKNOWN: "UNKNOWN",
} as const;
export type PhoneFormErrorCode =
	(typeof PhoneFormErrorCode)[keyof typeof PhoneFormErrorCode];

export interface PhoneFormSubmitError {
	field: "phone" | "root";
	code: PhoneFormErrorCode;
}

export const phoneFormSchema = z
	.object({
		phone: z.string().trim().min(1, PhoneFormErrorCode.PHONE_REQUIRED),
		country: countryCodeSchema,
		staySignedIn: z.boolean(),
	})
	.refine((data) => isValidPhoneNumber(data.phone, data.country), {
		path: ["phone"],
		error: PhoneFormErrorCode.PHONE_INVALID,
	})
	.transform(({ phone, country, staySignedIn }) => ({
		phone: parsePhoneNumberWithError(phone, country).number,
		staySignedIn: staySignedIn,
	}));

export type PhoneFormValues = z.input<typeof phoneFormSchema>;
export type PhoneFormOutput = z.output<typeof phoneFormSchema>;

export const PHONE_FORM_DEFAULTS: PhoneFormValues = {
	phone: "",
	country: "RU",
	staySignedIn: true,
};
