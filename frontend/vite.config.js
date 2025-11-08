import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0", // allow LAN access (optional)
      port: 5173,      // default Vite port
      open: true,      // auto-open browser
      cors: true,      // enable CORS for dev
      proxy: {
        "/api": {
          target: "http://localhost:4000", // backend URL
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      __DEV__: JSON.stringify(isDev),
    },
    build: {
      outDir: "dist",
      sourcemap: isDev,
    },
  };
});
