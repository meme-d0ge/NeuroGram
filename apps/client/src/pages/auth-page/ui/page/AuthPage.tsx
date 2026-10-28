import { Header } from "@/pages/auth-page/ui/header/Header.tsx";
import { PhoneStep } from "@/pages/auth-page/ui/phone-step/PhoneStep.tsx";
import styles from "./AuthPage.module.scss";

export const AuthPage = () => {
	return (
		<div className={styles.auth}>
			<Header />
			<main className={styles.auth__main}>
				<PhoneStep />
			</main>
		</div>
	);
};
