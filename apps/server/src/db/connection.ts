import type { Env } from "../config/env.js";

export function dbConnection(env: Env) {
	return {
		host: env.DB_HOST,
		port: env.DB_PORT,
		user: env.DB_USER,
		password: env.DB_PASSWORD,
		database: env.DB_NAME,
		ssl: env.DB_SSL,
	};
}
