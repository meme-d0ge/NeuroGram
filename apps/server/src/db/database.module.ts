import { Module, type OnModuleInit } from "@nestjs/common";
import { DrizzleModule, InjectDrizzle } from "@nestjs/drizzle";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { ENV } from "../config/config.module.js";
import type { Env } from "../config/env.js";
import { dbConnection } from "./connection.js";
import { type Database, relations } from "./relations.js";

@Module({
	imports: [
		DrizzleModule.forRootAsync({
			inject: [ENV],
			useFactory: (env: Env) => ({
				drizzle,
				relations,
				connection: dbConnection(env),
			}),
		}),
	],
})
export class DatabaseModule implements OnModuleInit {
	constructor(@InjectDrizzle() private readonly db: Database) {}

	async onModuleInit() {
		await this.db.execute(sql`select 1`);
	}
}
