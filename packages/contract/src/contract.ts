import type {
	InferContractRouterInputs,
	InferContractRouterOutputs,
} from "@orpc/contract";
import { sendAuth, verifyAuth } from "./module/otp/endpoints.js";

export const contract = {
	otp: {
		sendAuth,
		verifyAuth,
	},
};

export type ContractInputs = InferContractRouterInputs<typeof contract>;
export type ContractOutputs = InferContractRouterOutputs<typeof contract>;
