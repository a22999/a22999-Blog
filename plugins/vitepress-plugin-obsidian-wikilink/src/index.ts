import type { Plugin } from "vite";
import { glob } from "tinyglobby";
import { join, basename, extname } from "node:path";
import { readFileSync, existsSync } from "node:fs";
import matter from "gray-matter";
import { ObsidianWikilinkOptions, FileInfo, FileIndex } from "./types";
import {
  parseWikilink,
  resolveTargetUrl,
  isImageFile,
  headingToAnchor,
  slugify,
  DEFAULT_IMAGE_EXTENSIONS,
} from "./wikilink";
import log from "./log";

export * from "./types";
export * from "./wikilink";

/**
 * 默认忽略的目录
 */
const DEFAULT_IGNORE_DIR = ["**/node_modules/**", "**/dist/**"];

/**
 * Obsidian Wikilink Vite 插件
 *
 * 将 Obsidian 的 Wikilinks 语法转换为标准 Markdown 链接
 *
 * @example
 * ```ts
 * // vitepress/config.ts
 * import { vitePluginObsidianWikilink } from 'vitepress-plugin-obsidian-wikilink'
 *
 * export default defineConfig({
 *   vite: {
 *     plugins: [
 *       vitePluginObsidianWikilink({
 *         resolveMode: 'filePath',
 *         imageDir: '/attachments',
 *         onNotFound: 'keep',
 *       })
 *     ]
 *   }
 * })
 * ```
 */
export default function vitePluginObsidianWikilink(
  options: ObsidianWikilinkOptions = {}
): Plugin & { name: string } {
  const {
    resolveMode = "filePath",
    imageDir = "/attachments",
    onNotFound = "keep",
    placeholderTemplate = "[未找到: {filename}]",
    ignoreList = [],
    imageExtensions = DEFAULT_IMAGE_EXTENSIONS,
    warnOnNotFound = true,
    filePattern = "**/*.md",
  } = options;

  let fileIndex: FileIndex = new Map();
  let srcDir: string;
  let rewrites: Record<string, string>;
  let cleanUrls: boolean;
  let isExecute = false;

  /**
   * 判断文件路径是否在忽略列表中
   */
  const shouldIgnore = (filePath: string): boolean => {
    return ignoreList.some(
      item =>
        (typeof item === "string" && filePath.includes(item)) ||
        (item instanceof RegExp && item.test(filePath))
    );
  };

  /**
   * 构建文件索引
   */
  const buildIndex = async () => {
    fileIndex.clear();

    const patterns = Array.isArray(filePattern) ? filePattern : [filePattern];

    const files = await glob(patterns, {
      cwd: srcDir,
      expandDirectories: false,
      ignore: DEFAULT_IGNORE_DIR,
    });

    for (const file of files) {
      if (!file.endsWith(".md")) continue;

      const absolutePath = join(srcDir, file);
      if (!existsSync(absolutePath)) continue;

      const content = readFileSync(absolutePath, "utf-8");
      const { data: frontmatter } = matter(content);

      const filename = basename(file, ".md");
      const title = frontmatter.title || filename;

      // 构建相对路径
      const relativePath = "/" + file.replace(/\.md$/, cleanUrls ? "" : ".html");

      // 应用 rewrites
      const url = "/" + (rewrites?.[file] || file).replace(/\.md$/, cleanUrls ? "" : ".html");

      const fileInfo: FileInfo = {
        relativePath,
        url,
        filename,
        title,
        permalink: frontmatter.permalink,
        frontmatter,
      };

      // 以文件名（不含扩展名）为 key 存入索引（小写）
      fileIndex.set(filename.toLowerCase(), fileInfo);
      // 同时存储完整路径（不含扩展名）
      fileIndex.set(file.toLowerCase().replace(/\.md$/, ""), fileInfo);
    }

    log.info(`文件索引构建完成，共 ${fileIndex.size} 个文件`);
  };

  /**
   * 查找文件
   */
  const findFile = (filename: string): FileInfo | undefined => {
    // 直接查找
    const direct = fileIndex.get(filename.toLowerCase());
    if (direct) return direct;

    // 尝试部分匹配
    for (const [key, info] of fileIndex) {
      if (key.endsWith("/" + filename.toLowerCase()) || key === filename.toLowerCase()) {
        return info;
      }
    }

    return undefined;
  };

  /**
   * 转换单个 Wikilink
   */
  const convertWikilink = (match: string, currentFilePath: string): string => {
    const parsed = parseWikilink(match, imageExtensions);

    if (!parsed) return match;

    // 处理纯锚点链接 [[#heading]]
    if (parsed.isAnchorOnly) {
      if (!parsed.heading) return match;

      const anchor = headingToAnchor(parsed.heading);
      const text = parsed.displayText || parsed.heading;

      return `[${text}](#${anchor})`;
    }

    // 查找目标文件
    const fileInfo = findFile(parsed.filename);

    if (!fileInfo) {
      // 检查是否为图片（在 imageDir 中）
      if (parsed.isImage || isImageFile(parsed.filename, imageExtensions)) {
        const imageUrl = `${imageDir}/${parsed.filename}`;
        const alt = parsed.displayText || basename(parsed.filename, extname(parsed.filename));
        return `![${alt}](${imageUrl})`;
      }

      // 未找到文件
      if (warnOnNotFound) {
        log.warn(`未找到文件: ${parsed.filename} (在 ${currentFilePath} 中)`);
      }

      switch (onNotFound) {
        case "remove":
          return "";
        case "placeholder":
          return placeholderTemplate.replace("{filename}", parsed.filename);
        case "keep":
        default:
          return match;
      }
    }

    // 构建目标 URL
    const targetUrl = resolveTargetUrl(fileInfo, resolveMode, currentFilePath);

    // 构建显示文本
    let text = parsed.displayText;
    if (!text) {
      text = parsed.filename;
      if (parsed.heading) {
        text += `#${parsed.heading}`;
      }
    }

    // 构建完整 URL（包含锚点）
    let fullUrl = targetUrl;
    if (parsed.heading) {
      fullUrl += `#${headingToAnchor(parsed.heading)}`;
    }

    // 图片链接
    if (parsed.isImage || isImageFile(parsed.filename, imageExtensions)) {
      const alt = parsed.displayText || basename(parsed.filename, extname(parsed.filename));
      return `![${alt}](${fullUrl})`;
    }

    // 普通链接
    return `[${text}](${fullUrl})`;
  };

  /**
   * 转换 Markdown 内容中的所有 Wikilinks
   */
  const convertContent = (content: string, filePath: string): string => {
    // Wikilink 正则：匹配 !?[[...]]
    const wikilinkRegex = /(!?)\[\[([^\]]+)\]\]/g;

    return content.replace(wikilinkRegex, match => convertWikilink(match, filePath));
  };

  return {
    name: "vitepress-plugin-obsidian-wikilink",

    /**
     * 在 Vite 配置阶段初始化文件索引
     */
    async config(config: any) {
      if (isExecute) return;
      isExecute = true;

      const vitepressConfig = config.vitepress;
      srcDir = vitepressConfig.srcDir;
      rewrites = vitepressConfig.rewrites?.map || {};
      cleanUrls = vitepressConfig.cleanUrls || false;

      await buildIndex();

      log.info("Obsidian Wikilink 插件初始化完成");
    },

    /**
     * 使用 transform 钩子处理 Markdown 文件
     */
    transform(code: string, id: string) {
      // 只处理 .md 文件
      if (!id.endsWith(".md")) return null;

      // 检查文件是否存在
      if (!existsSync(id)) return null;

      // 检查是否在忽略列表中
      if (shouldIgnore(id)) return null;

      // 获取相对路径
      const relativePath = id.replace(srcDir, "").replace(/\\/g, "/");

      // 读取原始 Markdown 内容
      const content = readFileSync(id, "utf-8");

      // 检查是否包含 Wikilink 语法
      if (!content.includes("[[")) return null;

      // 转换 Wikilinks
      const convertedContent = convertContent(content, relativePath);

      // 如果内容没有变化，返回 null
      if (convertedContent === content) return null;

      return {
        code: convertedContent,
        map: null,
      };
    },

    /**
     * 在开发服务器启动时重新构建索引（热重载支持）
     */
    configureServer(server) {
      // 监听文件变化，更新索引
      server.watcher.on("add", async (file: string) => {
        if (file.endsWith(".md")) {
          await buildIndex();
        }
      });

      server.watcher.on("unlink", async (file: string) => {
        if (file.endsWith(".md")) {
          await buildIndex();
        }
      });
    },
  };
}

/**
 * 创建 Wikilink 解析器（用于自定义处理）
 */
export function createWikilinkParser(options: ObsidianWikilinkOptions = {}) {
  const { imageExtensions = DEFAULT_IMAGE_EXTENSIONS } = options;

  return {
    parse: (text: string) => parseWikilink(text, imageExtensions),
    isImageFile: (filename: string) => isImageFile(filename, imageExtensions),
    slugify,
    headingToAnchor,
  };
}
