import { Button } from "@base-ui/react";
import { clsx } from "clsx";
import { QrCode } from "lucide-react";
import type { ComponentProps } from "react";
import { useIntlayer } from "react-intlayer";
import styles from "./QrButton.module.scss";

interface QrButtonProps extends ComponentProps<typeof Button> {}
export const QrButton = ({ className, ...rest }: QrButtonProps) => {
	const content = useIntlayer("qr-button");

	return (
		<Button className={clsx(className, styles.qr__button)} {...rest}>
			<QrCode />
			<span>{content.qrcode}</span>
		</Button>
	);
};
