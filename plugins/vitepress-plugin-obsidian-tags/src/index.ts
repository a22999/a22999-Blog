import type { Plugin } from "vite";
import { normalizePath } from "vite";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { glob } from "tinyglobby";
import matter from "gray-matter";
import type { ObsidianTagsOptions } from "./types";
import { extractTags, getBodyContent } from "./extractor";
import { convertTagsToLinks } from "./converter";
import logger from "./log";

export * from "./types";
export { extractTags, convertTagsToLinks };

// 默认忽略的文件夹列表
const DEFAULT_IGNORE = ["**/node_modules/**", "**/dist/**"];

/**
 * VitePress 插件：提取和处理 Obsidian 风格的标签
 *
 * 功能：
 * 1. 从 Markdown 正文中提取 #tag 格式的标签
 * 2. 将提取的标签合并到 frontmatter 的 tags 字段
 * 3. 可选：将正文中的 #tag 转换为标签链接
 *
 * @example
 * ```ts
 * // vitepress config.ts
 * import obsidianTags from 'vitepress-plugin-obsidian-tags'
 *
 * export default defineConfig({
 *   vite: {
 *     plugins: [
 *       obsidianTags({
 *         pattern: '**/*.md',
 *         extractInlineTags: true,
 *         mergeToFrontmatter: true,
 *         convertToLinks: false,
 *         tagsPagePath: '/tags',
 *       })
 *     ]
 *   }
 * })
 * ```
 */
export default function VitePluginVitePressObsidianTags(options: ObsidianTagsOptions = {}): Plugin & { name: string } {
  let isExecute = false;

  return {
    name: "vitepress-plugin-obsidian-tags",

    async config(config: any) {
      // 防止 vitepress build 时重复执行
      if (isExecute) return;
      isExecute = true;

      let { pattern } = options;

      // 如果没有配置 pattern，则不执行
      if (!pattern) {
        logger.info("No pattern provided, skipping obsidian tags extraction. 未提供 pattern，跳过标签提取。");
        return;
      }

      const {
        mergeToFrontmatter = true,
        convertToLinks = false,
        globOptions,
        debug = false,
      } = options;

      const { srcDir } = config.vitepress;

      // 处理 pattern
      if (typeof pattern === "string") pattern = [pattern];
      pattern = pattern.map(p => normalizePath(join(srcDir, p)));

      // 获取匹配的文件列表
      const filePaths = await glob(pattern, {
        expandDirectories: false,
        ...globOptions,
        absolute: true,
        ignore: [...DEFAULT_IGNORE, ...(globOptions?.ignore || [])],
      });

      let totalTagsExtracted = 0;
      let totalTagsConverted = 0;
      let filesProcessed = 0;

      // 处理每个文件
      for (const filePath of filePaths) {
        if (!filePath.endsWith(".md")) continue;
        if (!existsSync(filePath)) continue;

        const result = processFile(filePath, srcDir, options);
        if (result) {
          totalTagsExtracted += result.tagsExtracted;
          totalTagsConverted += result.tagsConverted;
          filesProcessed++;
        }
      }

      // 输出处理结果
      if (debug || filesProcessed > 0) {
        logger.info(
          `Processed ${filesProcessed} files, extracted ${totalTagsExtracted} tags, converted ${totalTagsConverted} tags to links. ` +
            `处理了 ${filesProcessed} 个文件，提取了 ${totalTagsExtracted} 个标签，转换了 ${totalTagsConverted} 个标签为链接。`
        );
      }
    },
  };
}

/**
 * 处理单个文件
 */
const processFile = (
  filePath: string,
  srcDir: string,
  options: ObsidianTagsOptions
): { tagsExtracted: number; tagsConverted: number } | null => {
  const { mergeToFrontmatter = true, convertToLinks = false, debug = false } = options;

  const content = readFileSync(filePath, "utf-8");
  const { data: frontmatter, content: mdContent } = matter(content);

  // 获取 frontmatter 中的标签
  const frontmatterTags: string[] = Array.isArray(frontmatter.tags)
    ? frontmatter.tags.filter((t: unknown): t is string => typeof t === "string")
    : [];

  // 提取正文标签
  const extractionResult = extractTags(content, frontmatterTags, options);
  const newTags = extractionResult.inlineTags;

  // 检查是否有变化
  const hasNewTags = newTags.length > 0;
  const needsMerge = mergeToFrontmatter && hasNewTags;
  const needsConvert = convertToLinks;

  if (!needsMerge && !needsConvert) {
    return null;
  }

  let newContent = content;
  let tagsConverted = 0;

  // 转换标签为链接
  if (needsConvert) {
    const conversionResult = convertTagsToLinks(content, options);
    newContent = conversionResult.content;
    tagsConverted = conversionResult.convertedCount;
  }

  // 合并标签到 frontmatter
  if (needsMerge) {
    frontmatter.tags = extractionResult.tags;
    newContent = matter.stringify(getBodyContent(newContent), frontmatter);
  }

  // 写入文件
  if (newContent !== content) {
    writeFileSync(filePath, newContent, "utf-8");

    if (debug) {
      logger.info(`Updated: ${filePath}`);
    }
  }

  return {
    tagsExtracted: newTags.length,
    tagsConverted,
  };
};
