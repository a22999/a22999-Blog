import { createLogger, type LogOptions } from "vite";
import picocolors from "picocolors";
import type { Colors } from "picocolors/types";

type ColorsKey = keyof Omit<Colors, "isColorSupported">;

/**
 * 创建插件日志记录器
 *
 * @param pluginName 插件名称，如 "vitepress-plugin-auto-frontmatter"
 * @param version 插件版本号
 * @returns 日志工具对象，包含 info, warn, warnOnce, error 方法
 *
 * @example
 * ```ts
 * import { createLogger } from "vitepress-plugin-shared";
 * import { version } from "../package.json";
 *
 * const logger = createLogger("vitepress-plugin-auto-frontmatter", version);
 * logger.info("操作成功");
 * logger.warn("警告信息");
 * logger.error("错误信息");
 * ```
 */
export const createPluginLogger = (pluginName: string, version: string) => {
  const logger = createLogger("info", {
    prefix: `[${pluginName} v${version}]`,
  });

  const info = (message: string, level: ColorsKey = "green", option: LogOptions = { timestamp: true }) => {
    logger.info(picocolors[level](message), option);
  };

  const warn = (message: string, level: ColorsKey = "yellow", option: LogOptions = { timestamp: true }) => {
    logger.warn(picocolors[level](message), option);
  };

  const warnOnce = (message: string, level: ColorsKey = "yellow", option: LogOptions = { timestamp: true }) => {
    logger.info(picocolors[level](message), option);
  };

  const error = (message: string, level: ColorsKey = "red", option: LogOptions = { timestamp: true }) => {
    logger.error(picocolors[level](message), option);
  };

  return {
    logger,
    info,
    warn,
    warnOnce,
    error,
  };
};

export type { ColorsKey };
