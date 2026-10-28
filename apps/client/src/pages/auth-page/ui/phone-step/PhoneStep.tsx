import { Button } from "@base-ui/react";
import { QrCode } from "lucide-react";
import { useCallback, useState } from "react";
import { useIntlayer } from "react-intlayer";
import {
	PhoneForm,
	type TPhoneForm,
} from "@/pages/auth-page/ui/phone-form/PhoneForm.tsx";
import { QrCodeDialog } from "@/pages/auth-page/ui/qr-code-dialog/QrCodeDialog.tsx";
import { QrCodeSignIn } from "@/pages/auth-page/ui/qr-code-sign-in/QrCodeSignIn.tsx";
import { useMediaQuery } from "@/shared/lib/useMediaQuery.ts";
import styles from "./PhoneStep.module.scss";

export const PhoneStep = () => {
	const translate = useIntlayer("phone-step");

	const [isOpenQrCode, setIsOpenQrCode] = useState<boolean>(false);
	const isMobile = useMediaQuery("(max-width: 768px)");

	const onOpenChange = useCallback((value: boolean) => {
		setIsOpenQrCode(value);
	}, []);
	const openQrCode = useCallback(() => {
		setIsOpenQrCode(true);
	}, []);

	const onSubmitPhoneForm = useCallback((value: TPhoneForm) => {
		console.log(value);
	}, []);

	return (
		<div className={styles["phone-step__content"]}>
			{isMobile ? (
				<QrCodeDialog onOpenChange={onOpenChange} open={isOpenQrCode} />
			) : (
				<QrCodeSignIn />
			)}

			<PhoneForm
				onSubmit={onSubmitPhoneForm}
				footer={
					isMobile && (
						<Button
							onClick={openQrCode}
							className={styles["phone-step__dialog-close"]}
						>
							<QrCode />
							<span>{translate.qrcode}</span>
						</Button>
					)
				}
			/>
		</div>
	);
};
