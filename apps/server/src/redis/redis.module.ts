import {
	Global,
	Inject,
	Logger,
	Module,
	type OnApplicationShutdown,
} from "@nestjs/common";
import { Redis } from "ioredis";
import { ENV } from "../config/config.module.js";
import type { Env } from "../config/env.js";
import { REDIS_CLIENT } from "./redis.constants.js";

@Global()
@Module({
	providers: [
		{
			provide: REDIS_CLIENT,
			inject: [ENV],
			useFactory: async (env: Env): Promise<Redis> => {
				const logger = new Logger("Redis");
				const client = new Redis({
					host: env.REDIS_HOST,
					port: env.REDIS_PORT,
					username: env.REDIS_USERNAME,
					password: env.REDIS_PASSWORD,
					db: env.REDIS_DB,
					tls: env.REDIS_TLS ? {} : undefined,

					lazyConnect: true,
					connectTimeout: 5000,
					maxRetriesPerRequest: 3,
					connectionName: "neurogram-server",
				});

				client.on("error", (error) => logger.error(error.message));
				client.on("reconnecting", () => logger.warn("Reconnecting..."));

				await client.connect();
				return client;
			},
		},
	],
	exports: [REDIS_CLIENT],
})
export class RedisModule implements OnApplicationShutdown {
	constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

	async onApplicationShutdown(): Promise<void> {
		if (this.client.status === "end") return;
		try {
			await this.client.quit();
		} catch {
			this.client.disconnect();
		}
	}
}
