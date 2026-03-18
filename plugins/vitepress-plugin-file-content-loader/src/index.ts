import { readFileSync } from "node:fs";
import { normalizePath, type Plugin } from "vite";
import matter from "gray-matter";
import { glob, escapePath } from "tinyglobby";
import { createMarkdownRenderer } from "vitepress";
import { join } from "node:path";
import { FileContentLoaderData, FileContentLoaderOptions } from "./types";
import log, { logger } from "./log";

export * from "./types";

// 默认忽略的文件夹列表
export const DEFAULT_IGNORE_DIR = ["**/node_modules/**", "**/dist/**"];

/**
 * 转义 glob 模式中的路径特殊字符，但保留 glob 通配符
 */
function escapeGlobPattern(pattern: string): string {
  const parts = pattern.split("/");
  const escapedParts = parts.map(part => {
    // 保留 glob 通配符 ** 和 *
    if (part === "**" || part === "*") return part;
    // 使用 escapePath 转义路径中的特殊字符
    return escapePath(part);
  });
  return escapedParts.join("/");
}

export default function VitePluginVitePressFileContentLoader<T = FileContentLoaderData, R = FileContentLoaderData[]>(
  option: FileContentLoaderOptions<T, R>
): Plugin & { name: string } {
  let isExecute = false;

  return {
    name: "vite-plugin-vitepress-file-content-loader",
    async config(config: any) {
      // 防止 vitepress build 时重复执行
      if (isExecute) return;
      isExecute = true;

      let { pattern } = option;
      if (!pattern) return;

      const {
        includeSrc = false,
        render = false,
        excerpt: renderExcerpt,
        transformData,
        transformRaw,
        globOptions,
        themeConfigKey = "contentLoader",
      } = option;

      const {
        site: { themeConfig = {}, base },
        srcDir,
        cleanUrls,
        markdown,
        rewrites,
      } = config.vitepress;

      if (typeof pattern === "string") pattern = [pattern];

      // 转义 ignore 模式中的特殊字符（如括号）
      const ignorePatterns = ["**/node_modules/**", "**/dist/**", ...(globOptions?.ignore || [])].map(
        escapeGlobPattern
      );

      // 使用 cwd 指定搜索目录，pattern 保持相对路径
      const mdFiles = (
        await glob(pattern, {
          cwd: srcDir,
          expandDirectories: false,
          ...globOptions,
          ignore: ignorePatterns,
        })
      ).sort();

      const md = await createMarkdownRenderer(srcDir, markdown, base, logger);
      const raw: (FileContentLoaderData | Awaited<T>)[] = [];

      for (const file of mdFiles) {
        if (!file.endsWith(".md")) continue;

        // file 是相对于 srcDir 的路径，需要转换为绝对路径读取
        const absoluteFile = join(srcDir, file);
        const src = readFileSync(absoluteFile, "utf-8");
        const { data: frontmatter, excerpt } = matter(
          src,
          // @ts-expect-error gray-matter types are wrong
          typeof renderExcerpt === "string" ? { excerpt_separator: renderExcerpt } : { excerpt: renderExcerpt }
        );

        // file 已经是相对路径
        const path = normalizePath(file).replace(/(^|\/)index\.md$/, "$1");
        const relativePath = "/" + path.replace(/\.md$/, cleanUrls ? "" : ".html");
        const url = "/" + (rewrites.map[path] || path).replace(/\.md$/, cleanUrls ? "" : ".html");

        const html = render ? md.render(src) : undefined;
        const renderedExcerpt = renderExcerpt && excerpt?.endsWith("\n") ? md.render(excerpt) : undefined;

        const data: FileContentLoaderData = {
          src: includeSrc ? src : undefined,
          html,
          frontmatter,
          excerpt: renderedExcerpt,
          relativePath,
          url,
        };

        raw.push(transformData ? await transformData(data) : data);
      }

      themeConfig[themeConfigKey] = transformRaw ? await transformRaw(raw) : raw;

      const logName = themeConfigKey.charAt(0).toUpperCase() + themeConfigKey.slice(1);
      log.info(`Injected ${logName} Data Successfully. 注入 ${logName} 数据成功!`);
    },
  };
}
