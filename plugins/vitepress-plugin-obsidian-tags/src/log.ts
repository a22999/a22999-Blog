import { createPluginLogger } from "vitepress-plugin-shared";

// 默认版本号，实际构建时会从 package.json 读取
const version = "1.0.0";

export const { logger, info, warn, warnOnce, error } = createPluginLogger("vitepress-plugin-obsidian-tags", version);

export default {
  info,
  warn,
  warnOnce,
  error,
};
