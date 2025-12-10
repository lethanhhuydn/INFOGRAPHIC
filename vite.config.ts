import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
    },

    plugins: [react()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src")
      }
    },

    define: {
      __GEMINI_API_KEY__: JSON.stringify(env.VITE_GEMINI_API_KEY)
    }
  };
});
