import { type Dictionary, t } from "intlayer";

const qrButtonContent = {
	key: "qr-button",
	content: {
		qrcode: t({
			en: "Sign In with a QR Code",
			ru: "Войти по QR-коду",
		}),
	},
} satisfies Dictionary;

export default qrButtonContent;
