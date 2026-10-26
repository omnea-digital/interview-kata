import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: { outDir: "../dist/web", emptyOutDir: true },
  // The API runs as a separate process in development (see `npm run dev`).
  server: { proxy: { "/api": "http://localhost:3001" } },
});
