import {
	type CountryCode,
	getCountryCallingCode,
	getExampleNumber,
} from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";

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
