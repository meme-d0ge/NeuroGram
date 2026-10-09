import { createHash } from "node:crypto";
import { SessionToken } from "@repo/contract/module/session/entities";

export const hashSessionToken = (sessionToken: SessionToken) => {
	return createHash("sha256").update(sessionToken, "utf-8").digest("hex");
};
