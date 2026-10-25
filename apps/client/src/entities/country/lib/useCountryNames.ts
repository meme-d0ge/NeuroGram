import { getCountries } from "libphonenumber-js";
import { useMemo } from "react";
import { useLocale } from "react-intlayer";
import type { CountryCode } from "@/entities/country/model/countries.ts";

export const useCountryNames = () => {
	const { locale } = useLocale();
	return useMemo(() => {
		const displayNames = new Intl.DisplayNames([locale], { type: "region" });
		const collator = new Intl.Collator(locale);
		const getName = (code: CountryCode) => displayNames.of(code) ?? code;
		const codes = getCountries().toSorted((a, b) =>
			collator.compare(getName(a), getName(b)),
		);
		return { codes, getName };
	}, [locale]);
};
