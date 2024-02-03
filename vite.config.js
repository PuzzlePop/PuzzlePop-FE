import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      find: /^jss-plugin-(.*)$/,
      replacement: path.resolve(__dirname, "./node_modules/jss-plugin-$1/src/index.js"),
    },
  },
});
