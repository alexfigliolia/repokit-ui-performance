import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/args.ts"],
  dts: true,
  shims: true,
  clean: true,
  unbundle: true,
  format: ["cjs", "esm"],
});
