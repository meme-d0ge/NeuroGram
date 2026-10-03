import { Phone } from "@repo/contract/shared/entities/phone";

export abstract class SmsProviderService {
	abstract sendMessage(message: string, phone: Phone): Promise<void>;
}
