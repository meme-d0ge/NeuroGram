import { AuthHeader } from "@/widgets/AuthHeader/AuthHeader.tsx";
import { AuthWidget } from "@/widgets/AuthWidget/AuthWidget.tsx";
import styles from "./AuthPage.module.scss";

export const AuthPage = () => {
	return (
		<div className={styles.auth}>
			<AuthHeader />
			<main className={styles.auth__main}>
				<AuthWidget />
			</main>
		</div>
	);
};
