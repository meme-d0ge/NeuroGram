import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { getCookie } from "@orpc/server/helpers";
import { Request as ExpressRequest } from "express";
import { NAME_SESSION_COOKIE } from "../module/session/session.constant.js";
import { pickUaHeaders, UaHeaders } from "./pickUaHeaders.js";

export type ClientInfo = {
	ip: string;
	uaHeaders: UaHeaders;
	sessionTokenHash?: string;
};

export function toClientInfo(request: ExpressRequest): ClientInfo {
	return {
		ip: normalizeIp(request.ip),
		uaHeaders: pickUaHeaders(request.headers),
		sessionTokenHash: getSessionTokenHashFromCookie(request),
	};
}

function getSessionTokenHashFromCookie(request: ExpressRequest) {
	const sessionToken = getCookie(
		new Headers({ cookie: request.headers.cookie ?? "" }),
		NAME_SESSION_COOKIE,
	);
	if (!sessionToken) return undefined;
	return createHash("sha256").update(sessionToken, "utf-8").digest("hex");
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
