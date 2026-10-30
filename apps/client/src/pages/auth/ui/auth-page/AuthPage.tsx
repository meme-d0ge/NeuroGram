import { useMachine } from "@xstate/react";
import { useEffect } from "react";
import { AuthPageMachine } from "@/pages/auth/model/auth-page.machine.ts";
import { Header } from "@/pages/auth/ui/header/Header.tsx";
import { PhoneStep } from "@/pages/auth/ui/phone-step/PhoneStep.tsx";
import styles from "./AuthPage.module.scss";

export const AuthPage = () => {
	const [state, send] = useMachine(AuthPageMachine);

	useEffect(() => {
		console.log(state);
	}, [state]);
	return (
		<div className={styles.auth}>
			<Header />
			<main className={styles.auth__main}>
				{state.matches("phoneStep") && (
					<PhoneStep
						onSendOtp={(otpToken: string) =>
							send({ type: "SEND_OTP", otpToken: otpToken })
						}
					/>
				)}
			</main>
		</div>
	);
};
