import { Dialog } from "@base-ui/react";
import { X } from "lucide-react";
import { useCallback, useState } from "react";
import { useIntlayer } from "react-intlayer";
import { AuthByPhone } from "@/feature/AuthByPhone/AuthByPhone.tsx";
import { AuthByQrCode } from "@/feature/AuthByQrCode/AuthByQrCode.tsx";
import { useMediaQuery } from "@/shared/lib/useMediaQuery.ts";
import styles from "./AuthWidget.module.scss";

export const AuthWidget = () => {
	const { close } = useIntlayer("auth-widget");
	const isMobile = useMediaQuery(`(max-width: 767px)`);
	const [isQrOpen, setIsQrOpen] = useState<boolean>(false);

	const openQrCode = useCallback(() => {
		setIsQrOpen(true);
	}, []);

	return (
		<div className={styles["auth-widget"]}>
			{isMobile ? (
				<Dialog.Root open={isQrOpen} onOpenChange={setIsQrOpen}>
					<Dialog.Portal>
						<Dialog.Backdrop className={styles["auth-widget__backdrop"]} />
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
			) : (
				<AuthByQrCode />
			)}
			<AuthByPhone
				openQrCode={openQrCode}
				className={styles["auth-widget__phone"]}
			/>
		</div>
	);
};
