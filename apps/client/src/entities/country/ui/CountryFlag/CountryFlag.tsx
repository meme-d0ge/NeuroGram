import * as Flags from "country-flag-icons/react/3x2";
import type { CountryCode } from "@/entities/country/model/countries.ts";

interface CountryFlagProps {
	code: CountryCode;
	className?: string;
}
export const CountryFlag = (props: CountryFlagProps) => {
	// biome-ignore lint/performance/noDynamicNamespaceImportAccess: all flags need
	const Flag = Flags[props.code];
	return <Flag data-keep-colors className={props.className} />;
};
