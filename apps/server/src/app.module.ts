import { Module } from "@nestjs/common";
import { ORPCModule, onError } from "@orpc/nest";
import { OtpModule } from "./module/otp/otp.module.js";

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
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
