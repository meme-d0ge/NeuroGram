import { oc as _oc } from "@orpc/contract";

export const baseProcedure = _oc.errors({
    INTERNAL_SERVER_ERROR: {},
    TOO_MANY_REQUESTS: {},
});

export const protectedProcedure = baseProcedure.errors({
    UNAUTHORIZED: {},
});