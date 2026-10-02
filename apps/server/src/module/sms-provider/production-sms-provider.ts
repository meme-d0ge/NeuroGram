import { Injectable, Logger } from "@nestjs/common";
import { Phone } from "@repo/contract/shared/entities";
import { SmsProviderService } from "./sms-provider.service.js";

@Injectable()
export class ProductionSmsProvider extends SmsProviderService {
	private readonly logger = new Logger(ProductionSmsProvider.name);
	async sendMessage(_message: string, _phone: Phone) {
		this.logger.log("SMS provider is not implemented yet");
	}
}
