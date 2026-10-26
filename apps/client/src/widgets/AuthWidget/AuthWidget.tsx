import { Dialog } from "@base-ui/react";
import { X } from "lucide-react";
import { useCallback, useState } from "react";
import { useIntlayer } from "react-intlayer";
import { AuthByPhone } from "@/feature/AuthByPhone/AuthByPhone.tsx";
import { AuthByQrCode } from "@/feature/AuthByQrCode/AuthByQrCode.tsx";
import { useMediaQuery } from "@/shared/lib/useMediaQuery.ts";
import styles from "./AuthWidget.module.scss";

const AuthByQrCodeWrapper = (props: {
	isQrOpen: boolean;
	setIsQrOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { close } = useIntlayer("auth-widget");
	const isMobile = useMediaQuery(`(max-width: 768px)`);

	if (isMobile) {
		return (
			<Dialog.Root open={props.isQrOpen} onOpenChange={props.setIsQrOpen}>
				<Dialog.Portal>
					<Dialog.Backdrop />
					<Dialog.Popup className={styles["auth-widget__qr-dialog"]}>
						<Dialog.Close
							className={styles["auth-widget__close-btn"]}
							aria-label={close}
						>
							<X />
						</Dialog.Close>
						<AuthByQrCode className={styles["auth-widget__qr-body"]} />
					</Dialog.Popup>
				</Dialog.Portal>
			</Dialog.Root>
		);
	}
	return <AuthByQrCode />;
};

export const AuthWidget = () => {
	const [isQrOpen, setIsQrOpen] = useState<boolean>(false);

	const openQrCode = useCallback(() => {
		setIsQrOpen(true);
	}, []);

	return (
		<div className={styles["auth-widget"]}>
			<AuthByQrCodeWrapper isQrOpen={isQrOpen} setIsQrOpen={setIsQrOpen} />
			<AuthByPhone openQrCode={openQrCode} />
		</div>
	);
};
