import { type Dictionary, t } from "intlayer";

const qrCodeDialogContent = {
	key: "qr-code-dialog",
	content: {
		close: t({
			ru: "Закрыть",
			en: "Close",
		}),
	},
} satisfies Dictionary;

export default qrCodeDialogContent;
