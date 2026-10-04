import { Module } from "@nestjs/common";
import { SmsProviderModule } from "../sms-provider/sms-provider.module.js";
import { OtpService } from "./otp.service.js";

@Module({
	providers: [OtpService],
	imports: [SmsProviderModule],
	exports: [OtpService],
})
export class OtpModule {}
