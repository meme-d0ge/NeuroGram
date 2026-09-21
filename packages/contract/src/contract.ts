import { sendAuth, verify } from "./module/otp/endpoints.js";
import {
	InferContractRouterInputs,
	InferContractRouterOutputs,
} from "@orpc/contract";

export const contract = {
	otp: {
		sendAuth,
		verify,
	},
};

export type ContractInputs = InferContractRouterInputs<typeof contract>;
export type ContractOutputs = InferContractRouterOutputs<typeof contract>;
