import { isIP } from "node:net";
import { Request as ExpressRequest } from "express";
import { pickUaHeaders, UaHeaders } from "./pickUaHeaders.js";

export type ClientInfo = {
	ip: string;
	uaHeaders: UaHeaders;
};

export function toClientInfo(request: ExpressRequest): ClientInfo {
	return {
		ip: normalizeIp(request.ip),
		uaHeaders: pickUaHeaders(request.headers),
	};
}

function normalizeIp(raw: string | undefined): string {
	if (!raw || isIP(raw) === 0) {
		throw new Error(
			`Cannot determine client IP (got: ${raw}). Check "trust proxy" and proxy setup.`,
		);
	}
	const unmapped = raw.startsWith("::ffff:") ? raw.slice(7) : raw;
	return isIP(unmapped) === 4 ? unmapped : raw;
}
