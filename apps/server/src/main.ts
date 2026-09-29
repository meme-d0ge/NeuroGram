import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { OpenAPIGenerator } from "@orpc/openapi";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { contract } from "@repo/contract";
import { apiReference } from "@scalar/express-api-reference";
import { AppModule } from "./app.module.js";
import { ENV } from "./config/config.module.js";
import type { Env } from "./config/env.js";

function loadDotenv(): void {
	let dir = process.cwd();
	for (let depth = 0; depth < 5; depth++) {
		const candidate = resolve(dir, ".env");
		if (existsSync(candidate)) {
			process.loadEnvFile(candidate);
			return;
		}
		const parent = dirname(dir);
		if (parent === dir) return;
		dir = parent;
	}
}

async function bootstrap() {
	loadDotenv();

	const app = await NestFactory.create(AppModule, { abortOnError: false });
	app.enableShutdownHooks();

	const generator = new OpenAPIGenerator({
		schemaConverters: [new ZodToJsonSchemaConverter()],
	});
	const spec = await generator.generate(contract, {
		info: { title: "NeuroGram API", version: "0.0.1" },
	});

	const expressApp = app.getHttpAdapter().getInstance();
	expressApp.use("/docs", apiReference({ content: spec }));

	const env = app.get<Env>(ENV);
	await app.listen(env.PORT);
}

try {
	await bootstrap();
} catch (error) {
	new Logger("Bootstrap").error(
		`Failed to start: ${error instanceof Error ? error.message : error}`,
	);
	process.exit(1);
}
