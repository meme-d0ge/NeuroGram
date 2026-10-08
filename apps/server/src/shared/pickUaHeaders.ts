import type { IncomingHttpHeaders } from "node:http";

const UA_HEADERS = [
	"user-agent",
	"sec-ch-ua",
	"sec-ch-ua-mobile",
	"sec-ch-ua-platform",
	"sec-ch-ua-platform-version",
	"sec-ch-ua-model",
	"sec-ch-ua-full-version-list",
	"sec-ch-ua-form-factors",
] as const;

type UaHeaderName = (typeof UA_HEADERS)[number];
export type UaHeaders = Partial<Record<UaHeaderName, string>>;

const MAX_HEADER_LENGTH = 512;
export function pickUaHeaders(headers: IncomingHttpHeaders): UaHeaders {
	const result: UaHeaders = {};
	for (const name of UA_HEADERS) {
		const value = headers[name];
		if (typeof value === "string" && value.length > 0) {
			result[name] = value.slice(0, MAX_HEADER_LENGTH);
		}
	}
	return result;
}
