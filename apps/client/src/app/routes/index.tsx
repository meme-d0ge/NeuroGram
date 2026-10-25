import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/pages/AuthPage/AuthPage.tsx";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AuthPage />;
}
