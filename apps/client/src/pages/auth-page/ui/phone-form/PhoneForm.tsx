import { Button } from "@base-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	isValidPhoneNumber,
	parsePhoneNumberWithError,
} from "libphonenumber-js";
import { type ReactNode, useCallback } from "react";
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
import styles from "./PhoneForm.module.scss";

const phoneFormSchema = z
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

export type PhoneFormOutput = z.infer<typeof phoneFormSchema>;

interface PhoneFormProps {
	className?: string;
	onSubmit: SubmitHandler<PhoneFormOutput>;
	footer?: ReactNode;
}
export const PhoneForm = (props: PhoneFormProps) => {
	const translate = useIntlayer("phone-form");

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(phoneFormSchema),
		defaultValues: {
			phone: "",
			country: "RU" as ValidCountryCode,
			staySignedIn: true,
		},
		mode: "onTouched",
	});

	const countryValue = useWatch({ control, name: "country" });
	const translateError = useCallback(
		(code: string | undefined) =>
			code && Object.hasOwn(translate.errorMessages, code)
				? translate.errorMessages[code as keyof typeof translate.errorMessages]
				: translate.errorMessages.UNKNOWN,
		[translate.errorMessages],
	);

	return (
		<div className={`${styles["phone-form"]} ${props.className ?? ""}`}>
			<div className={styles["phone-form__head"]}>
				<p className={styles["phone-form__head-title"]}>{translate.title}</p>
				<p className={styles["phone-form__head-subtitle"]}>
					{translate.subtitle}
				</p>
			</div>
			<form
				onSubmit={handleSubmit(props.onSubmit)}
				className={styles["phone-form__form"]}
			>
				<FormField
					label={translate.country}
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
					label={translate.phone}
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
							className={styles["phone-form__form-checkbox"]}
							id={"staySignedIn"}
							text={translate.checkbox}
							checked={field.value}
							onCheckedChange={field.onChange}
						/>
					)}
				/>

				<Button type="submit" className={styles["phone-form__submit-btn"]}>
					{translate.submit}
				</Button>
			</form>

			{props.footer}
		</div>
	);
};
