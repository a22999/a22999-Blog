import { createPluginBuildConfig, vitepressExternals } from "../../../build/plugin-build";
import { copy } from "fs-extra";

export default createPluginBuildConfig({
  entries: [
    "src/index",
    "src/usePermalink",
    "src/rewrites",
    { builder: "mkdist", input: "src/components", outDir: "dist/components", pattern: ["**/*.vue"], loaders: ["vue"] },
  ],
  externals: [...vitepressExternals, "vue", "fs-extra"],
  failOnWarn: false,
  hooks: {
    "build:done": async () => {
      await copy("src/vitepress-router.d.ts", "dist/vitepress-router.d.ts");
    },
  },
});
