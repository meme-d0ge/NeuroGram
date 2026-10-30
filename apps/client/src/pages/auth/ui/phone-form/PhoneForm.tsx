import { Button } from "@base-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useIntlayer } from "react-intlayer";
import {
	CountrySelect,
	getDialCode,
	getPhonePlaceholder,
} from "@/entities/country";
import { PhoneInput } from "@/entities/phone";
import { BaseCheckBox } from "@/shared/ui/BaseCheckBox";
import { FormField } from "@/shared/ui/FormField";
import {
	PHONE_FORM_DEFAULTS,
	type PhoneFormOutput,
	type PhoneFormSubmitError,
	phoneFormSchema,
} from "../../model/phone-form.ts";
import styles from "./PhoneForm.module.scss";

interface PhoneFormProps {
	className?: string;
	onSubmit: (value: PhoneFormOutput) => Promise<PhoneFormSubmitError | null>;
}
export const PhoneForm = (props: PhoneFormProps) => {
	const translate = useIntlayer("phone-form");
	const {
		control,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(phoneFormSchema),
		defaultValues: PHONE_FORM_DEFAULTS,
		mode: "onTouched",
	});
	const countryValue = useWatch({ control, name: "country" });
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const translateError = useCallback(
		(code: string | undefined) =>
			code && Object.hasOwn(translate.errorMessages, code)
				? translate.errorMessages[code as keyof typeof translate.errorMessages]
				: translate.errorMessages.UNKNOWN,
		[translate.errorMessages],
	);

	return (
		<form
			onSubmit={handleSubmit(async (values) => {
				setIsLoading(true);
				const error = await props.onSubmit(values);
				setIsLoading(false);
				if (!error) return;
				setError(error.field === "root" ? "root.server" : error.field, {
					message: error.code,
				});
			})}
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
				{!isLoading && translate.submit}
				{isLoading && (
					<LoaderCircle className={styles["phone-form__submit-btn-loader"]} />
				)}
			</Button>
		</form>
	);
};
