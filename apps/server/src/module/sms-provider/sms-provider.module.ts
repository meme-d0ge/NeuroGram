import { Module } from "@nestjs/common";
import { ENV } from "../../config/config.module.js";
import { Env } from "../../config/env.js";
import { DevelopSmsProvider } from "./develop-sms-provider.js";
import { ProductionSmsProvider } from "./production-sms-provider.js";
import { SmsProviderService } from "./sms-provider.service.js";

@Module({
	providers: [
		{
			provide: SmsProviderService,
			useFactory: (env: Env) => {
				if (env.NODE_ENV === "development") return new DevelopSmsProvider();
				else return new ProductionSmsProvider();
			},
			inject: [ENV],
		},
	],
	exports: [SmsProviderService],
})
export class SmsProviderModule {}
