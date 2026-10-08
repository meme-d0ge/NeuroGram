import { z } from "zod";
import { baseProcedure } from "../../shared/procedures.js";
import { sessionDataSchema } from "./entities.js";

export const getAllSession = baseProcedure
	.route({ method: "GET", path: "/session/" })
	.output(
		z.object({
			sessions: z.array(sessionDataSchema),
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
			session: sessionDataSchema,
		}),
	);

export const deleteSession = baseProcedure.route({
	method: "DELETE",
	path: "/session/:id",
});
