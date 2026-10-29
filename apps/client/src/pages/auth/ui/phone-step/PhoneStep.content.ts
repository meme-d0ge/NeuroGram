import { type Dictionary, t } from "intlayer";

const phoneStepContent = {
	key: "phone-step",
	content: {
		qrcode: t({
			en: "Sign In with a QR Code",
			ru: "Войти по QR-коду",
		}),
	},
} satisfies Dictionary;

export default phoneStepContent;
