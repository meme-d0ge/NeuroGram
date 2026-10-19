import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Fragment } from "react";
import "@/app/styles/styles.scss";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<Fragment>
			<div>Hello "__root"!</div>
			<Outlet />
		</Fragment>
	);
}
