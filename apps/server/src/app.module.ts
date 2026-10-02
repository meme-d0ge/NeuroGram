import { Module } from "@nestjs/common";
import { ORPCModule, onError } from "@orpc/nest";
import { ConfigModule } from "./config/config.module.js";
import { DatabaseModule } from "./db/database.module.js";
import { OtpModule } from "./module/otp/otp.module.js";
import { SmsProviderModule } from "./module/sms-provider/sms-provider.module.js";
import { RedisModule } from "./redis/redis.module.js";

@Module({
	imports: [
		ConfigModule,
		RedisModule,
		ORPCModule.forRoot({
			interceptors: [
				onError((error) => {
					console.error(error);
				}),
			],
			eventIteratorKeepAliveInterval: 5000,
		}),
		DatabaseModule,
		OtpModule,
		SmsProviderModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
