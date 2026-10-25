import { Input } from "@base-ui/react";
import type { ComponentProps } from "react";
import styles from "./PhoneInput.module.scss";

interface PhoneInputProps
	extends Omit<
		ComponentProps<typeof Input>,
		"type" | "inputMode" | "autoComplete" | "className"
	> {
	prefix: string;
}
export const PhoneInput = ({ prefix, ...inputProps }: PhoneInputProps) => (
	<div className={styles["phone-input"]}>
		<span>{prefix}</span>
		<div className={styles["phone-input__divider"]} />
		<Input
			{...inputProps}
			type="tel"
			inputMode="tel"
			autoComplete="tel-national"
			className={styles["phone-input__input"]}
		/>
	</div>
);
