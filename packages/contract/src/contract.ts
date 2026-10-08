import type {
	InferContractRouterInputs,
	InferContractRouterOutputs,
} from "@orpc/contract";
import { sendCode, signIn, signUp } from "./module/auth/endpoints.js";
import {
	deleteAllSession,
	deleteSession,
	getAllSession,
	getSession,
} from "./module/session/endpoints.js";

export const contract = {
	auth: {
		sendCode,
		signIn,
		signUp,
	},
	session: {
		getAllSession,
		deleteAllSession,
		getSession,
		deleteSession,
	},
};

export type ContractInputs = InferContractRouterInputs<typeof contract>;
export type ContractOutputs = InferContractRouterOutputs<typeof contract>;
