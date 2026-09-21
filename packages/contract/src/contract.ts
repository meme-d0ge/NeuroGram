import { otpSendAuth, otpVerification } from "./module/otp/endpoints.js";

export const contract = {
	otp: {
		otpSendAuth,
		otpVerification,
	},
};
