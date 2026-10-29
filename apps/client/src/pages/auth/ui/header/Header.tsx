import { Logo } from "@/shared/ui/Logo/ui/Logo.tsx";
import styles from "./Header.module.scss";
export const Header = () => {
	return (
		<header className={styles.header}>
			<Logo />
			{/* TODO lang change */}
		</header>
	);
};
