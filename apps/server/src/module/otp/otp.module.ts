import { Module } from "@nestjs/common";
import { OtpController } from "./otp.controller.js";

@Module({
	controllers: [OtpController],
})
export class OtpModule {}
