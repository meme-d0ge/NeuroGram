import { useIntlayer } from "react-intlayer";
import styles from "./AuthByQrCode.module.scss";
import qrcode from "./img/qr_code.png";

export interface AuthByQrCodeProps {
	className?: string;
}
export const AuthByQrCode = (props: AuthByQrCodeProps) => {
	const { steps, title } = useIntlayer("auth-by-qr-code");

	return (
		<div className={`${styles.qrcode} ${props.className ?? ""}`}>
			<div className={styles["qrcode__img-container"]}>
				<img src={qrcode} className={styles.qrcode__img} alt="qrcode-img" />
				{/* TODO real qrcode auth */}
			</div>
			<div className={styles.qrcode__info}>
				<p className={styles["qrcode__info-title"]}>{title}</p>
				<ol type="1" className={styles["qrcode__info-steps"]}>
					{steps.map((step) => (
						<li key={step} className={styles["qrcode__info-step"]}>
							{step}
						</li>
					))}
				</ol>
			</div>
		</div>
	);
};
