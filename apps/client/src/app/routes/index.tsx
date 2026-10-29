import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/pages/auth";

export const Route = createFileRoute("/")({
	component: AuthPage,
});
