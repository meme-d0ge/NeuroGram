import { Logger, Module } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { ORPCError, ORPCModule, onError } from "@orpc/nest";
import { ResponseHeadersPlugin } from "@orpc/server/plugins";
import type { Request as ExpressRequest } from "express";
import { ConfigModule } from "./config/config.module.js";
import { DatabaseModule } from "./db/database.module.js";
import { AuthModule } from "./module/auth/auth.module.js";
import { OtpModule } from "./module/otp/otp.module.js";
import { SessionModule } from "./module/session/session.module.js";
import { SmsProviderModule } from "./module/sms-provider/sms-provider.module.js";
import { RedisModule } from "./redis/redis.module.js";
import { toClientInfo } from "./shared/toClientInfo.js";

@Module({
	imports: [
		ConfigModule,
		RedisModule,
		ORPCModule.forRootAsync({
			useFactory: (request: ExpressRequest) => ({
				interceptors: [
					onError((error) => {
						if (!(error instanceof ORPCError) || error.status >= 500) {
							Logger.error(error);
						}
					}),
				],
				context: toClientInfo(request),
				plugins: [new ResponseHeadersPlugin()],
				eventIteratorKeepAliveInterval: 5000,
			}),
			inject: [REQUEST],
		}),
		DatabaseModule,
		OtpModule,
		SmsProviderModule,
		AuthModule,
		SessionModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
