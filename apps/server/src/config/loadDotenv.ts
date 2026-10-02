import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

export function loadDotenv(): void {
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
