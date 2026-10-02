import { Injectable, Logger } from "@nestjs/common";
import { Phone } from "@repo/contract/shared/entities";
import { SmsProviderService } from "./sms-provider.service.js";

@Injectable()
export class DevelopSmsProvider extends SmsProviderService {
	private readonly logger = new Logger(DevelopSmsProvider.name);
	async sendMessage(message: string, phone: Phone) {
		this.logger.log(`SMS would be sent to ${phone}: ${message}`);
	}
}
