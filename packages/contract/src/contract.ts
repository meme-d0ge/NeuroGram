import type {
	InferContractRouterInputs,
	InferContractRouterOutputs,
} from "@orpc/contract";
import { sendCode, signIn, signUp } from "./module/auth/endpoints.js";

export const contract = {
	auth: {
		sendCode,
		signIn,
		signUp,
	},
};

export type ContractInputs = InferContractRouterInputs<typeof contract>;
export type ContractOutputs = InferContractRouterOutputs<typeof contract>;
