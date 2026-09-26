import { Module } from "@nestjs/common";
import { ORPCModule, onError } from "@orpc/nest";
import { OtpModule } from "./module/otp/otp.module.js";
import { RedisModule } from "./redis/redis.module.js";

@Module({
	imports: [
		ORPCModule.forRoot({
			interceptors: [
				onError((error) => {
					console.error(error);
				}),
			],
			eventIteratorKeepAliveInterval: 5000,
		}),
		OtpModule,
		RedisModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
