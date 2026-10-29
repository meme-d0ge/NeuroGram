import type { ReactNode } from "react";
import styles from "./FormField.module.scss";

interface FormFieldProps {
	label: ReactNode;
	htmlFor: string;
	error?: ReactNode;
	className?: string;
	children: ReactNode;
}

export const FormField = ({
	label,
	htmlFor,
	error,
	className,
	children,
}: FormFieldProps) => (
	<div className={`${styles["form-field"]} ${className ?? ""}`}>
		<label
			htmlFor={htmlFor}
			className={`${styles["form-field__label"]} ${error ? styles["form-field__label--error"] : ""}`}
		>
			{label}
		</label>
		{children}
		<div
			className={styles["form-field__error"]}
			data-visible={!!error}
			aria-live="polite"
		>
			<p className={styles["form-field__error-text"]}>{error}</p>
		</div>
	</div>
);
