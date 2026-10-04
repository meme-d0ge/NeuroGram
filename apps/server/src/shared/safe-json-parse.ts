import { z } from "zod";
import { err, ok, Result } from "./result.js";
export function safeJsonParse(raw: string): Result<unknown> {
	try {
		return ok(JSON.parse(raw) as unknown);
	} catch (cause) {
		return err(
			cause instanceof Error
				? cause
				: new Error(`JSON.parse failed: ${String(cause)}`, { cause }),
		);
	}
}
export function parseJson<S extends z.ZodType>(
	raw: string,
	schema: S,
): Result<z.output<S>> {
	const json = safeJsonParse(raw);
	if (!json.success) return json;

	const parsed = schema.safeParse(json.data);
	if (!parsed.success) {
		return err(
			new Error(z.prettifyError(parsed.error), { cause: parsed.error }),
		);
	}
	return ok(parsed.data);
}
