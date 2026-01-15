import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../dist/frontend",
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true, // Necesario para Docker en Windows/Mac
      interval: 100,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@api": path.resolve(__dirname, "./src/api"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@context": path.resolve(__dirname, "./src/context"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@router": path.resolve(__dirname, "./src/router"),
      "@middlewares": path.resolve(__dirname, "./src/middlewares"),
      "@interfaces": path.resolve(__dirname, "./src/interfaces"),
      "@styles/components": path.resolve(__dirname, "./src/components/styles"),
      "@styles/pages": path.resolve(__dirname, "./src/pages/styles"),

      // Backend imports - Shared types, contracts, entities
      "@backend/core": path.resolve(__dirname, "../backend/src/core"),
    },
  },
});
