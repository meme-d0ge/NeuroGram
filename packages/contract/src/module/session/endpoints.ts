import { z } from "zod";
import { baseProcedure } from "../../shared/procedures.js";
import { SessionData } from "./entities.js";

export const getAllSession = baseProcedure
	.route({ method: "GET", path: "/session/" })
	.output(
		z.object({
			sessions: z.array(SessionData),
		}),
	);

export const deleteAllSession = baseProcedure.route({
	method: "DELETE",
	path: "/session",
});

export const getSession = baseProcedure
	.route({
		method: "GET",
		path: "/session/:id",
	})
	.output(
		z.object({
			session: SessionData,
		}),
	);

export const deleteSession = baseProcedure.route({
	method: "DELETE",
	path: "/session/:id",
});
