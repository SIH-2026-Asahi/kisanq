import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Set base to "/<your-repo-name>/" before deploying to GitHub Pages
// (a project page is served from https://<user>.github.io/<repo-name>/,
// so asset paths must be prefixed with the repo name). Keep it "/" for
// local dev and for a user/organization page repo (<user>.github.io).
export default defineConfig({
  base: "/kisanq/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
