import {
	type CountryCode,
	getCountries,
	getCountryCallingCode,
	getExampleNumber,
} from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";
import { z } from "zod";

export type { CountryCode };

export const getDialCode = (code: CountryCode) =>
	`+${getCountryCallingCode(code)}`;

export const getPhonePlaceholder = (code: CountryCode) => {
	const example = getExampleNumber(code, examples);
	if (!example) return "";
	return example
		.formatInternational()
		.replace(`+${example.countryCallingCode}`, "")
		.trim()
		.replace(/\d/g, "0");
};

const countries = getCountries() as CountryCode[];
export const countryCodeSchema = z.enum(countries);
export type ValidCountryCode = z.infer<typeof countryCodeSchema>;
