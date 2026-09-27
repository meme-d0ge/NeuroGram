import { Module } from "@nestjs/common";
import { ORPCModule, onError } from "@orpc/nest";
import { ConfigModule } from "./config/config.module.js";
import { OtpModule } from "./module/otp/otp.module.js";
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
		OtpModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
