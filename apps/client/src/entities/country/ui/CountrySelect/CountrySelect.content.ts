import { type Dictionary, t } from "intlayer";

const countrySelectContent = {
	key: "country-select",
	content: {
		back: t({
			en: "Back",
			ru: "Назад",
		}),
		selectCountry: t({
			en: "Select country",
			ru: "Выберите страну",
		}),
		searchCountryOrCode: t({
			en: "Search country or code",
			ru: "Найти страну или код",
		}),
	},
} satisfies Dictionary;

export default countrySelectContent;
