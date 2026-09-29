// AI
import type {
	AnyContractProcedure,
	InferContractRouterErrorMap,
} from "@orpc/contract";
import type { ORPCErrorConstructorMap } from "@orpc/server";
import type { contract } from "@repo/contract";

type ErrorConstructorsOf<T> = T extends AnyContractProcedure
	? ORPCErrorConstructorMap<InferContractRouterErrorMap<T>>
	: { [K in keyof T]: ErrorConstructorsOf<T[K]> };
export type ContractErrors = ErrorConstructorsOf<typeof contract>;
