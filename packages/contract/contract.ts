import {otpSendAuth, otpVerification} from "./src/module/otp/endpoints";

export const contract = {
    otp: {
        otpSendAuth,
        otpVerification
    }
}