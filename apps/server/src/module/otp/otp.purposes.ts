type OtpPurposeConfig = {
	ttlSeconds: number;
	maxAttempts: number;
	cooldownSeconds: number;
	message: (code: string) => string;
};

export const OTP_PURPOSES = {
	auth: {
		ttlSeconds: 300,
		maxAttempts: 5,
		cooldownSeconds: 60,
		message: (code) => `Your NeuroGram login code: ${code}`,
	},
} satisfies Record<string, OtpPurposeConfig>;

export type OtpPurpose = keyof typeof OTP_PURPOSES;
