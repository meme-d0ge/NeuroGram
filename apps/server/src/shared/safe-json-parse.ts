import { z } from "zod";
export type Ok<T> = { success: true; data: T; error?: never };
export type Err<E> = { success: false; data?: never; error: E };
export type Result<T, E = Error> = Ok<T> | Err<E>;

export function ok<T>(data: T): Ok<T> {
	return { success: true, data };
}
export function err<E>(error: E): Err<E> {
	return { success: false, error };
}
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
