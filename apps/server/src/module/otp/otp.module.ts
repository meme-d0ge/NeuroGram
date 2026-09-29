import { Module } from "@nestjs/common";
import { SmsProviderModule } from "../sms-provider/sms-provider.module.js";
import { OtpController } from "./otp.controller.js";
import { OtpService } from "./otp.service.js";

@Module({
	controllers: [OtpController],
	providers: [OtpService],
	imports: [SmsProviderModule],
})
export class OtpModule {}
