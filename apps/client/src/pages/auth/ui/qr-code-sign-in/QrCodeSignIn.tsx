import { clsx } from "clsx";
import { useIntlayer } from "react-intlayer";
import qrcode from "./img/qr_code.png";
import styles from "./QrCodeSignIn.module.scss";

export interface QrCodeSignInProps {
	className?: string;
}
export const QrCodeSignIn = (props: QrCodeSignInProps) => {
	const translate = useIntlayer("qr-code-sign-in");

	return (
		<div className={clsx(styles.qrcode, props.className)}>
			<div className={styles["qrcode__img-container"]}>
				<img src={qrcode} alt="qrcode" />
				{/* TODO real qrcode auth */}
			</div>
			<div className={styles.qrcode__info}>
				<p className={styles["qrcode__info-title"]}>{translate.title}</p>
				<ol type="1" className={styles["qrcode__info-steps"]}>
					{translate.steps.map((step) => (
						<li key={step} className={styles["qrcode__info-step"]}>
							{step}
						</li>
					))}
				</ol>
			</div>
		</div>
	);
};
