import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { routeTree } from "./app/routeTree.gen";

const root = document.getElementById("root");
if (root === null) throw new Error("Root element not found");

const router = createRouter({ routeTree });
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

createRoot(root).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
