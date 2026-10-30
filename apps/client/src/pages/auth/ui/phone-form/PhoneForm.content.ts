import { type Dictionary, t } from "intlayer";
import type { PhoneFormErrorCode } from "@/pages/auth/model/phone-form.ts";

const phoneFormContent = {
	key: "phone-form",
	content: {
		country: t({
			en: "Country",
			ru: "Страна",
		}),
		phone: t({
			en: "Phone Number",
			ru: "Номер телефона",
		}),
		checkbox: t({
			en: "Stay signed in on this device",
			ru: "Не выходить на этом устройстве",
		}),
		submit: t({
			en: "Submit",
			ru: "Далее",
		}),
		errorMessages: {
			PHONE_REQUIRED: t({
				en: "Enter your phone number",
				ru: "Введите номер телефона",
			}),
			PHONE_INVALID: t({
				en: "Invalid number for the selected country",
				ru: "Неверный номер для выбранной страны",
			}),
			UNKNOWN: t({ en: "Check this field", ru: "Проверьте поле" }),
		} satisfies Record<PhoneFormErrorCode, unknown>,
	},
} satisfies Dictionary;

export default phoneFormContent;
