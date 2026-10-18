import { SessionData } from "@repo/contract/module/session/entities";
import { sessionsTable } from "../../db/schema.js";

export function toSessionData(
	row: typeof sessionsTable.$inferSelect,
): SessionData {
	return {
		id: row.id,
		ip: row.ip,
		device: row.device,
		platform: row.platform,
		application: row.application,
		location: row.location,
		login_date: row.createdAt,
		last_active_date: row.lastActiveDate,
	};
}
