import { defineConfig } from "drizzle-kit";
import { loadEnv } from "./src/config/env.js";
import { loadDotenv } from "./src/config/loadDotenv.js";
import { dbConnection } from "./src/db/connection.js";

loadDotenv();
const env = loadEnv();

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/db/schema.ts",
	out: "drizzle",
	dbCredentials: dbConnection(env),
});
