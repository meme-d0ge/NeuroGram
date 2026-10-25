import { type Dictionary, t } from "intlayer";

const authWidgetContent = {
	key: "auth-widget",
	content: {
		close: t({
			en: "Close",
			ru: "Закрыть",
		}),
	},
} satisfies Dictionary;

export default authWidgetContent;
