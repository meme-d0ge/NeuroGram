import { type Dictionary, t } from "intlayer";

const authByQrContent = {
	key: "auth-by-qr-code",
	content: {
		title: t({
			en: "Sign In with a QR Code",
			ru: "Войти по QR-коду",
		}),
		steps: [
			t({
				en: "Open NeuroGram on your phone",
				ru: "Откройте NeuroGram на телефоне",
			}),
			t({
				en: "Settings → Devices → Connect",
				ru: "Настройки → Устройства → Подключить",
			}),
			t({
				en: "Point your camera at this code",
				ru: "Наведите камеру на этот код",
			}),
		],
	},
} satisfies Dictionary;

export default authByQrContent;
