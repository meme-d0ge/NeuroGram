import { useCallback, useState } from "react";
import { useIntlayer } from "react-intlayer";
import { PhoneForm } from "@/pages/auth/ui/phone-form/PhoneForm.tsx";
import { QrButton } from "@/pages/auth/ui/qr-button/QrButton.tsx";
import { QrCodeDialog } from "@/pages/auth/ui/qr-code-dialog/QrCodeDialog.tsx";
import { QrCodeSignIn } from "@/pages/auth/ui/qr-code-sign-in/QrCodeSignIn.tsx";
import { useIsMobile } from "@/shared/lib/breakpoints.ts";
import { Card } from "@/shared/ui/Card";
import {
	PhoneFormErrorCode,
	type PhoneFormOutput,
	type PhoneFormSubmitError,
} from "../../model/phone-form.ts";
import styles from "./PhoneStep.module.scss";

interface PhoneStepProps {
	onSendOtp: (otpToken: string) => void;
}
export const PhoneStep = (props: PhoneStepProps) => {
	const content = useIntlayer("phone-step");
	const isMobile = useIsMobile();

	const [isOpenQrCode, setIsOpenQrCode] = useState<boolean>(false);

	const onSubmitPhoneForm = useCallback(
		async (value: PhoneFormOutput): Promise<PhoneFormSubmitError | null> => {
			console.log(value);

			//fake api
			await new Promise((resolve) => setTimeout(resolve, 10000));

			const error = null;
			const otpToken = "fake";

			switch (error) {
				case null: {
					props.onSendOtp(otpToken);
					return null;
				}
				default:
					return { field: "root", code: PhoneFormErrorCode.UNKNOWN };
			}
		},
		[props.onSendOtp],
	);

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
