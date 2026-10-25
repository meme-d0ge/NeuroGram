import { Button } from "@base-ui/react";
import { QrCode } from "lucide-react";
import { useState } from "react";
import { useIntlayer } from "react-intlayer";
import {
	type CountryCode,
	getDialCode,
	getPhonePlaceholder,
} from "@/entities/country/model/countries.ts";
import { CountrySelect } from "@/entities/country/ui/CountrySelect/CountrySelect.tsx";
import { PhoneInput } from "@/entities/phone/ui/PhoneInput/PhoneInput.tsx";
import { BaseCheckBox } from "@/shared/ui/BaseCheckBox/BaseCheckBox.tsx";
import styles from "./AuthByPhone.module.scss";

interface AuthByPhoneProps {
	className?: string;
	openQrCode: () => void;
}
export const AuthByPhone = (props: AuthByPhoneProps) => {
	const { title, subtitle, checkbox, qrcode, submit, country, phone } =
		useIntlayer("auth-by-phone");
	// TODO: RHF
	const [countryCode, setCountryCode] = useState<CountryCode>("RU");
	const [phoneNumber, setPhoneNumber] = useState<string>("");

	return (
		<div className={`${styles["auth-phone"]} ${props.className ?? ""}`}>
			<div className={styles["auth-phone__head"]}>
				<p className={styles["auth-phone__head-title"]}>{title}</p>
				<p className={styles["auth-phone__head-subtitle"]}>{subtitle}</p>
			</div>
			<form className={styles["auth-phone__form"]}>
				<div className={styles["auth-phone__form-field"]}>
					<label
						className={styles["auth-phone__form-label"]}
						htmlFor="country-select"
					>
						{country}
					</label>
					<CountrySelect
						id="country-select"
						value={countryCode}
						onChange={setCountryCode}
					/>
				</div>
				<div className={styles["auth-phone__form-field"]}>
					<label
						htmlFor="phone-input"
						className={styles["auth-phone__form-label"]}
					>
						{phone}
					</label>
					<PhoneInput
						id="phone-input"
						prefix={getDialCode(countryCode)}
						placeholder={getPhonePlaceholder(countryCode)}
						defaultValue={phoneNumber}
						onValueChange={setPhoneNumber}
					/>
				</div>
				<BaseCheckBox
					className={styles["auth-phone__form-checkbox"]}
					id={"not-logout-checkbox"}
					text={checkbox}
				/>
				<Button type="submit" className={styles["auth-phone__submit-btn"]}>
					{submit}
				</Button>
			</form>

			<Button
				onClick={props.openQrCode}
				className={styles["auth-phone__qrcode-btn"]}
			>
				<QrCode />
				<span>{qrcode}</span>
			</Button>
		</div>
	);
};
