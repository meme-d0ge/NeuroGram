import { Logo } from "@/shared/ui/Logo/Logo.tsx";
import styles from "./AuthHeader.module.scss";
export const AuthHeader = () => {
	return (
		<header className={styles.header}>
			<Logo />
			{/* TODO lang change */}
		</header>
	);
};
