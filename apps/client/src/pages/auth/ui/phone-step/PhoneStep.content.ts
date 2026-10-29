import { type Dictionary, t } from "intlayer";

const phoneStepContent = {
	key: "phone-step",
	content: {
		title: t({
			en: "Sign In with Phone Number",
			ru: "Вход по номеру",
		}),
		subtitle: t({
			en: "We'll send a code to the app or via text message",
			ru: "Отправим код в приложение или по СМС",
		}),
	},
} satisfies Dictionary;

export default phoneStepContent;
