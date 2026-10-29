import { Checkbox } from "@base-ui/react";
import { clsx } from "clsx";
import { Check } from "lucide-react";
import type { ComponentProps } from "react";
import styles from "./BaseCheckBox.module.scss";

interface BaseCheckBoxProps
	extends Omit<ComponentProps<typeof Checkbox.Root>, "className"> {
	className?: string;
	text: string;
}
export const BaseCheckBox = (props: BaseCheckBoxProps) => {
	const { className, text, ...rest } = props;

	return (
		<label htmlFor={rest.id} className={clsx(styles.label, className)}>
			<Checkbox.Root {...rest} className={styles.checkbox}>
				<Checkbox.Indicator className={styles.indicator}>
					<Check />
				</Checkbox.Indicator>
			</Checkbox.Root>
			{props.text}
		</label>
	);
};
