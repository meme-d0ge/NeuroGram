import { Button } from "@base-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	isValidPhoneNumber,
	parsePhoneNumberWithError,
} from "libphonenumber-js";
import { QrCode } from "lucide-react";
import { useEffect } from "react";
import {
	Controller,
	type SubmitHandler,
	useForm,
	useWatch,
} from "react-hook-form";
import { useIntlayer } from "react-intlayer";
import { z } from "zod";
import {
	countryCodeSchema,
	getDialCode,
	getPhonePlaceholder,
	type ValidCountryCode,
} from "@/entities/country/model/countries.ts";
import { CountrySelect } from "@/entities/country/ui/CountrySelect/CountrySelect.tsx";
import { PhoneInput } from "@/entities/phone/ui/PhoneInput/PhoneInput.tsx";
import { BaseCheckBox } from "@/shared/ui/BaseCheckBox/BaseCheckBox.tsx";
import styles from "./AuthByPhone.module.scss";

const authByPhoneFormSchema = z
	.object({
		phone: z.string().trim().min(1, "PHONE_REQUIRED"),
		country: countryCodeSchema,
		staySignedIn: z.boolean(),
	})
	.refine((data) => isValidPhoneNumber(data.phone, data.country), {
		path: ["phone"],
		error: "PHONE_INVALID",
	})
	.transform(({ phone, country, staySignedIn }) => ({
		phone: parsePhoneNumberWithError(phone, country).number,
		staySignedIn: staySignedIn,
	}));

type AuthByPhoneForm = z.infer<typeof authByPhoneFormSchema>;

interface AuthByPhoneProps {
	className?: string;
	openQrCode: () => void;
}
export const AuthByPhone = (props: AuthByPhoneProps) => {
	const { title, subtitle, checkbox, qrcode, submit, country, phone } =
		useIntlayer("auth-by-phone");

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(authByPhoneFormSchema),
		defaultValues: {
			phone: "",
			country: "RU" as ValidCountryCode,
			staySignedIn: true,
		},
	});

	const countryValue = useWatch({ control, name: "country" });
	const onSubmit: SubmitHandler<AuthByPhoneForm> = (data) => console.log(data);

	useEffect(() => {
		console.log(errors);
	}, [errors]);

	return (
		<div className={`${styles["auth-phone"]} ${props.className ?? ""}`}>
			<div className={styles["auth-phone__head"]}>
				<p className={styles["auth-phone__head-title"]}>{title}</p>
				<p className={styles["auth-phone__head-subtitle"]}>{subtitle}</p>
			</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className={styles["auth-phone__form"]}
			>
				<div className={styles["auth-phone__form-field"]}>
					<label className={styles["auth-phone__form-label"]} htmlFor="country">
						{country}
					</label>
					<Controller
						control={control}
						name="country"
						rules={{ deps: ["phone"] }}
						render={({ field }) => (
							<CountrySelect
								id="country"
								value={field.value}
								onChange={field.onChange}
							/>
						)}
					/>
				</div>
				<div className={styles["auth-phone__form-field"]}>
					<label htmlFor="phone" className={styles["auth-phone__form-label"]}>
						{phone}
					</label>

					<Controller
						control={control}
						name="phone"
						render={({ field }) => (
							<PhoneInput
								id="phone"
								prefix={getDialCode(countryValue)}
								placeholder={getPhonePlaceholder(countryValue)}
								value={field.value}
								onValueChange={field.onChange}
								onBlur={field.onBlur}
								ref={field.ref}
							/>
						)}
					/>
				</div>
				<Controller
					control={control}
					name="staySignedIn"
					render={({ field }) => (
						<BaseCheckBox
							className={styles["auth-phone__form-checkbox"]}
							id={"staySignedIn"}
							text={checkbox}
							checked={field.value}
							onCheckedChange={field.onChange}
						/>
					)}
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
