import type {
	InferContractRouterInputs,
	InferContractRouterOutputs,
} from "@orpc/contract";
import { login, register } from "./module/auth/endpoints.js";
import { sendAuth, verifyAuth } from "./module/otp/endpoints.js";

export const contract = {
	otp: {
		sendAuth,
		verifyAuth,
	},
	auth: {
		login,
		register,
	},
};

export type ContractInputs = InferContractRouterInputs<typeof contract>;
export type ContractOutputs = InferContractRouterOutputs<typeof contract>;
