import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig({
  server: {
    watch: {
      // Browser profile databases are locked while Edge is running.
      ignored: ["**/.preview-browser/**", "**/preview-*.png"],
    },
  },
  plugins: [
    createHtmlPlugin({
      // Keep generated HTML readable for editor diagnostics.
      minify: false,
    }),
  ],
  base: "/",
});
