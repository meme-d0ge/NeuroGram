import "@orpc/nest";

declare module "@orpc/nest" {
	interface ORPCGlobalContext {
		resHeaders?: Headers;
	}
}
