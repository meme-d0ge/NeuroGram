import { readFileSync } from "node:fs";
import type { Result } from "ioredis";

const lua = (file: string) =>
	readFileSync(new URL(`./scripts/${file}`, import.meta.url), "utf8");

export const otpScripts = {
	cooldown: { lua: lua("cooldown.lua"), numberOfKeys: 1 },
};

declare module "ioredis" {
	interface RedisCommander<Context> {
		cooldown(
			key: string,
			ttlSeconds: number,
		): Result<["EXISTED" | "CREATED", number], Context>;
	}
}
