import { type Options, defineConfig } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["src/**/*.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  minify: false,
  external: ["react"],
  ...options,
}));
