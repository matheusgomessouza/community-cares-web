import { defineConfig } from "vitest/config";
import path from 'path';

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true, // Optional: Allows global access to `expect`, `vi`, etc.
    setupFiles: "./vitest.setup.ts", // Add the setup file to load jest-dom
    typecheck: {
      tsconfig: "./tsconfig.json",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Add other aliases from your tsconfig.json paths here
    },
  },
});
