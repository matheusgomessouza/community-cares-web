import { defineConfig } from "vitest/config";
import tsconfigPaths from 'vite-plugin-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true, // Optional: Allows global access to `expect`, `vi`, etc.
    setupFiles: "./vitest.setup.ts", // Add the setup file to load jest-dom
    typecheck: {
      tsconfig: "./tsconfig.json",
    },
  },
});
