import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tanstackRouter({
			routesDirectory: "./src/app/routes",
			generatedRouteTree: "./src/app/routeTree.gen.ts",
		}),
		react(),
	],
	resolve: {
		alias: {
			"@": `${import.meta.dirname}/src`,
		},
	},
});
