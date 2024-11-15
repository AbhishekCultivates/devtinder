import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./client/postcss.config.js", // Ensure the PostCSS config path is correct
  },
  build: {
    outDir: "client/dist", // Specify the build output directory
  },
  // Optional: If deploying under a subpath, specify a base
  base: "/", // Set this if needed for base path in your deployment
});
