import { Injectable } from "@nestjs/common";
import type { ContractInputs, ContractOutputs } from "@repo/contract";

@Injectable()
export class OtpService {
	async sendAuth(
		_input: ContractInputs["otp"]["sendAuth"],
	): Promise<ContractOutputs["otp"]["sendAuth"]> {
		return { verificationToken: "testVerificationToken" };
	}
	async verify(
		_input: ContractInputs["otp"]["verify"],
	): Promise<ContractOutputs["otp"]["verify"]> {
		return {
			token: "testToken",
		};
	}
}
