import { Controller } from "@nestjs/common";
import { Implement, implement } from "@orpc/nest";
import { contract } from "@repo/contract";

@Controller()
export class OtpController {
	@Implement(contract.otp)
	otp() {
		return implement(contract.otp).router({
			otpSendAuth: implement(contract.otp.otpSendAuth).handler(
				async ({ input }) => {
					throw new Error(`Not implemented: send OTP to ${input.phone}`);
				},
			),
			otpVerification: implement(contract.otp.otpVerification).handler(
				async ({ input }) => {
					throw new Error(`Not implemented: verify OTP ${input.code}`);
				},
			),
		});
	}
}
