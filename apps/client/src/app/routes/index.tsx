import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/pages/auth/ui/auth-page/AuthPage.tsx";

export const Route = createFileRoute("/")({
	component: AuthPage,
});
