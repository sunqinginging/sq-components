/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  test: {
    globals: true,
    environment: "jsdom",
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "SqComponents",
      fileName: "sq-components",
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
        },
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name == "sq-components.css") {
            return "index.css";
          }
          return chunkInfo.name;
        },
      },
    },
  },
});
