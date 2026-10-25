import { createRootRoute, Outlet } from "@tanstack/react-router";
import "@/app/styles/styles.scss";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return <Outlet />;
}
