import styles from "./Logo.module.scss";
export const Logo = () => {
	return (
		<p className={styles.logo}>
			neuro<span className={styles["logo-accent"]}>gram</span>
		</p>
	);
};
