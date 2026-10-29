import { clsx } from "clsx";
import type { ComponentProps } from "react";
import styles from "./Card.module.scss";

export const Card = ({ className, ...rest }: ComponentProps<"div">) => {
	return <div className={clsx(className, styles.card)} {...rest}></div>;
};
