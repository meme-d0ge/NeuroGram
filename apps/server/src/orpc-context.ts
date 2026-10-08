import "@orpc/nest";
import { UaHeaders } from "./shared/pickUaHeaders.js";

declare module "@orpc/nest" {
	interface ORPCGlobalContext {
		resHeaders?: Headers;
		ip: string;
		uaHeaders: UaHeaders;
	}
}
