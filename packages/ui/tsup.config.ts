import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["src/index.tsx"],
  format: ["esm"],
  sourcemap: true,
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"',
    };
  },
  dts: true,
  minify: false,
  external: ["react"],
  ...options,
}));
