import { Controller } from "@nestjs/common";
import { Implement, implement } from "@orpc/nest";
import { contract } from "@repo/contract";
import { OtpService } from "./otp.service.js";

@Controller()
export class OtpController {
	constructor(private readonly otpService: OtpService) {}

	@Implement(contract.otp)
	otp() {
		return implement(contract.otp).router({
			sendAuth: implement(contract.otp.sendAuth).handler(({ input, errors }) =>
				this.otpService.sendAuth(input, errors),
			),
			verifyAuth: implement(contract.otp.verifyAuth).handler(
				({ input, errors }) => this.otpService.verifyAuth(input, errors),
			),
		});
	}
}
