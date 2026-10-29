import { Dialog } from "@base-ui/react";
import { X } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { QrCodeSignIn } from "@/pages/auth/ui/qr-code-sign-in/QrCodeSignIn.tsx";
import styles from "./QrCodeDialog.module.scss";

interface QrCodeDialogProps
	extends Pick<
		React.ComponentProps<typeof Dialog.Root>,
		"open" | "onOpenChange"
	> {}
export const QrCodeDialog = (props: QrCodeDialogProps) => {
	const { close } = useIntlayer("qr-code-dialog");
	return (
		<Dialog.Root open={props.open} onOpenChange={props.onOpenChange}>
			<Dialog.Portal>
				<Dialog.Backdrop />
				<Dialog.Popup className={styles.qr__dialog}>
					<Dialog.Close className={styles.qr__close} aria-label={close}>
						<X />
					</Dialog.Close>
					<QrCodeSignIn className={styles.qr__body} />
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	);
};
