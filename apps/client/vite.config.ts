import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { intlayer } from "vite-intlayer";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tanstackRouter({
			routesDirectory: "./src/app/routes",
			generatedRouteTree: "./src/app/routeTree.gen.ts",
		}),
		react(),
		intlayer(),
	],
	resolve: {
		alias: {
			"@": `${import.meta.dirname}/src`,
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: (source: string, filename: string) =>
					filename.includes("/src/app/styles/")
						? source
						: `
							@use "@/app/styles/mixins" as *;\n
							@use "@/app/styles/media" as *;\n
							${source}
						`,
			},
		},
	},
});
