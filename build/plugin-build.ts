import type { BuildConfig } from "unbuild";
import { defineBuildConfig } from "unbuild";

/**
 * 插件构建配置选项
 */
export interface PluginBuildOptions {
  /**
   * 外部依赖列表
   * @default ["vite"]
   */
  externals?: string[];
  /**
   * 是否启用 esbuild 压缩
   * @default false
   */
  minify?: boolean;
  /**
   * 入口文件配置
   * @default ["src/index"]
   */
  entries?: BuildConfig["entries"];
  /**
   * 是否在警告时失败
   * @default true
   */
  failOnWarn?: boolean;
  /**
   * 构建钩子
   */
  hooks?: BuildConfig["hooks"];
}

/**
 * 默认外部依赖
 */
const defaultExternals = ["vite", "vitepress-plugin-shared"];

/**
 * VitePress 相关的外部依赖
 */
export const vitepressExternals = ["vitepress", "vite", "vitepress-plugin-shared"];

/**
 * 创建插件构建配置
 * @param options 插件构建选项
 * @returns unbuild 配置
 */
export function createPluginBuildConfig(options: PluginBuildOptions = {}) {
  const { externals = defaultExternals, minify = false, entries = ["src/index"], failOnWarn = true, hooks } = options;

  return defineBuildConfig({
    entries,
    clean: true,
    declaration: true,
    rollup: {
      emitCJS: true,
      output: {
        exports: "named",
      },
      ...(minify && {
        esbuild: {
          minify: true,
        },
      }),
    },
    externals,
    failOnWarn,
    ...(hooks && { hooks }),
  });
}

export { defineBuildConfig };
