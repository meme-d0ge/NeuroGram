import { z } from "zod";
import { baseProcedure } from "../../shared/procedures.js";
import { sessionDataSchema, sessionIdSchema } from "./entities.js";

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
		path: "/session/{id}",
	})
	.input(z.object({ id: sessionIdSchema }))
	.output(
		z.object({
			session: sessionDataSchema,
		}),
	)
	.errors({
		NOT_FOUND_SESSION: {
			status: 404,
		},
	});

export const deleteSession = baseProcedure
	.route({
		method: "DELETE",
		path: "/session/{id}",
	})
	.input(z.object({ id: sessionIdSchema }))
	.errors({
		CANNOT_DELETE_CURRENT_SESSION: {
			status: 403,
		},
		NOT_FOUND_SESSION: {
			status: 404,
		},
	});
