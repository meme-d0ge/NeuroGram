import { useCallback, useState } from "react";
import { useIntlayer } from "react-intlayer";
import { PhoneForm } from "@/pages/auth/ui/phone-form/PhoneForm.tsx";
import { QrButton } from "@/pages/auth/ui/qr-button/QrButton.tsx";
import { QrCodeDialog } from "@/pages/auth/ui/qr-code-dialog/QrCodeDialog.tsx";
import { QrCodeSignIn } from "@/pages/auth/ui/qr-code-sign-in/QrCodeSignIn.tsx";
import { useIsMobile } from "@/shared/lib/breakpoints.ts";
import { Card } from "@/shared/ui/Card";
import type { PhoneFormOutput } from "../../model/phone-form.ts";
import styles from "./PhoneStep.module.scss";

export const PhoneStep = () => {
	const [isOpenQrCode, setIsOpenQrCode] = useState<boolean>(false);
	const isMobile = useIsMobile();

	const onSubmitPhoneForm = useCallback((value: PhoneFormOutput) => {
		console.log(value);
	}, []);

	const content = useIntlayer("phone-step");

	return (
		<div className={styles["phone-step__content"]}>
			{isMobile ? (
				<QrCodeDialog onOpenChange={setIsOpenQrCode} open={isOpenQrCode} />
			) : (
				<QrCodeSignIn />
			)}

			<Card className={styles["phone-step__form"]}>
				<div className={styles["phone-step__form-head"]}>
					<p className={styles["phone-step__form-head-title"]}>
						{content.title}
					</p>
					<p className={styles["phone-step__form-head-subtitle"]}>
						{content.subtitle}
					</p>
				</div>
				<PhoneForm onSubmit={onSubmitPhoneForm} />
				{isMobile && <QrButton onClick={() => setIsOpenQrCode(true)} />}
			</Card>
		</div>
	);
};
