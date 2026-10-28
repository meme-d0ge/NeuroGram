import { Logo } from "@/shared/ui/Logo/Logo.tsx";
import styles from "./Header.module.scss";
export const Header = () => {
	return (
		<header className={styles.header}>
			<Logo />
			{/* TODO lang change */}
		</header>
	);
};
