import { type Dictionary, t } from "intlayer";

const authbyphoneContent = {
	key: "auth-by-phone",
	content: {
		title: t({
			en: "Sign In with Phone Number",
			ru: "Вход по номеру",
		}),
		subtitle: t({
			en: "We'll send a code to the app or via text message",
			ru: "Отправим код в приложение или по СМС",
		}),
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
		qrcode: t({
			en: "Sign In with a QR Code",
			ru: "Войти по QR-коду",
		}),
	},
} satisfies Dictionary;

export default authbyphoneContent;
