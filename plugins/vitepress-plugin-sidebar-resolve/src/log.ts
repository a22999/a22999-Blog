import { createPluginLogger } from "vitepress-plugin-shared";
import { version } from "../package.json";

export const { logger, info, warn, warnOnce, error } = createPluginLogger("vitepress-plugin-sidebar-resolve", version);

export default {
  info,
  warn,
  warnOnce,
  error,
};
