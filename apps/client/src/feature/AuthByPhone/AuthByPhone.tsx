import { Button } from "@base-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	isValidPhoneNumber,
	parsePhoneNumberWithError,
} from "libphonenumber-js";
import { QrCode } from "lucide-react";
import { useCallback, useEffect } from "react";
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
import { FormField } from "@/shared/ui/FormField/FormField.tsx";
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
	const {
		title,
		subtitle,
		checkbox,
		qrcode,
		submit,
		country,
		phone,
		errorMessages,
	} = useIntlayer("auth-by-phone");

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
		mode: "onTouched",
	});

	const countryValue = useWatch({ control, name: "country" });
	const onSubmit: SubmitHandler<AuthByPhoneForm> = (data) => console.log(data);

	const translateError = useCallback(
		(code: string | undefined) =>
			code && Object.hasOwn(errorMessages, code)
				? errorMessages[code as keyof typeof errorMessages]
				: errorMessages.UNKNOWN,
		[errorMessages],
	);

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
				<FormField
					label={country}
					htmlFor="country"
					error={errors.country && translateError(errors.country.message)}
				>
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
				</FormField>

				<FormField
					label={phone}
					htmlFor="phone"
					error={errors.phone && translateError(errors.phone.message)}
				>
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
				</FormField>

				<Controller
					control={control}
					name="staySignedIn"
					render={({ field }) => (
						// TODO add staySignedIn functional
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
