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
			sendAuth: implement(contract.otp.sendAuth).handler(({ input }) =>
				this.otpService.sendAuth(input),
			),
			verify: implement(contract.otp.verify).handler(({ input }) =>
				this.otpService.verify(input),
			),
		});
	}
}
