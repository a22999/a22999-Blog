import { basename, extname } from "node:path";
import type { FileInfo, FileIndex, ParsedWikilink, ObsidianWikilinkOptions, ResolveMode } from "./types";
import log from "./log";

/**
 * 默认图片扩展名
 */
export const DEFAULT_IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "svg", "webp", "bmp", "ico"];

/**
 * 判断文件是否为图片
 */
export function isImageFile(filename: string, imageExtensions: string[] = DEFAULT_IMAGE_EXTENSIONS): boolean {
  const ext = extname(filename).slice(1).toLowerCase();
  return imageExtensions.includes(ext);
}

/**
 * 将字符串 slug 化
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fa5\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * 将标题转换为 URL 安全的锚点
 */
export function headingToAnchor(heading: string): string {
  return slugify(heading);
}

/**
 * 解析 Wikilink 语法
 *
 * 支持的格式:
 * - [[filename]] -> 链接到文件
 * - [[filename|显示文本]] -> 带显示文本的链接
 * - [[filename#heading]] -> 链接到文件的特定标题
 * - [[filename#heading|显示文本]] -> 带显示文本和标题的链接
 * - [[#heading]] -> 当前文件内的锚点
 * - ![[image.png]] -> 嵌入图片
 * - ![[filename]] -> 嵌入文件（转换为普通链接）
 */
export function parseWikilink(
  text: string,
  imageExtensions: string[] = DEFAULT_IMAGE_EXTENSIONS
): ParsedWikilink | null {
  // Wikilink 正则表达式
  // 匹配: !?[[...]]
  const wikilinkRegex = /^(!?)\[\[([^\]]+)\]\]$/;
  const match = text.match(wikilinkRegex);

  if (!match) return null;

  const [, embedPrefix, content] = match;
  const isEmbed = embedPrefix === "!";

  // 处理纯锚点: [[#heading]] 或 [[#heading|显示文本]]
  if (content.startsWith("#")) {
    const anchorMatch = content.match(/^#([^|]+)(?:\|(.+))?$/);
    if (anchorMatch) {
      return {
        raw: text,
        isEmbed: false, // 纯锚点不支持嵌入
        filename: "",
        displayText: anchorMatch[2]?.trim() || anchorMatch[1].trim(),
        heading: anchorMatch[1].trim(),
        isImage: false,
        isAnchorOnly: true,
      };
    }
  }

  // 解析内容: filename#heading|displayText 或 filename|displayText 或 filename#heading
  let filename = "";
  let heading: string | undefined;
  let displayText: string | undefined;

  // 先检查是否有显示文本（| 后面的部分）
  const pipeIndex = content.indexOf("|");
  if (pipeIndex !== -1) {
    displayText = content.slice(pipeIndex + 1).trim();
  }

  // 检查是否有标题锚点（# 后面的部分）
  const hashIndex = content.indexOf("#", 1); // 从第2个字符开始找，避免路径开头的 /
  if (hashIndex !== -1) {
    heading = content.slice(hashIndex + 1).trim();
    filename = content.slice(0, pipeIndex !== -1 ? Math.min(pipeIndex, hashIndex) : hashIndex).trim();
  } else if (pipeIndex !== -1) {
    filename = content.slice(0, pipeIndex).trim();
  } else {
    filename = content.trim();
  }

  const isImage = isImageFile(filename, imageExtensions);

  return {
    raw: text,
    isEmbed,
    filename,
    displayText,
    heading,
    isImage,
    isAnchorOnly: false,
  };
}

/**
 * 构建 Markdown 链接
 */
export function buildMarkdownLink(parsed: ParsedWikilink, targetUrl: string, options: ObsidianWikilinkOptions): string {
  const { displayText, heading } = parsed;

  // 构建完整 URL
  let fullUrl = targetUrl;
  if (heading) {
    fullUrl += `#${headingToAnchor(heading)}`;
  }

  // 构建显示文本
  let text = displayText;
  if (!text) {
    if (parsed.isAnchorOnly) {
      text = heading || "";
    } else if (parsed.isImage) {
      // 图片使用文件名（不含扩展名）作为 alt
      text = basename(parsed.filename, extname(parsed.filename));
    } else {
      text = parsed.filename;
      if (heading) {
        text += `#${heading}`;
      }
    }
  }

  // 根据是否为图片或嵌入语法决定链接类型
  if (parsed.isImage || (parsed.isEmbed && isImageFile(parsed.filename, options.imageExtensions))) {
    return `![${text}](${fullUrl})`;
  }

  return `[${text}](${fullUrl})`;
}

/**
 * 处理未找到文件的情况
 */
export function handleNotFound(parsed: ParsedWikilink, options: ObsidianWikilinkOptions): string {
  const { onNotFound = "keep", placeholderTemplate = "[未找到: {filename}]" } = options;

  switch (onNotFound) {
    case "remove":
      return "";
    case "placeholder":
      return placeholderTemplate.replace("{filename}", parsed.filename);
    case "keep":
    default:
      return parsed.raw;
  }
}

/**
 * 根据解析模式获取目标 URL
 */
export function resolveTargetUrl(fileInfo: FileInfo, mode: ResolveMode, currentFilePath: string): string {
  switch (mode) {
    case "permalink":
      return fileInfo.permalink || fileInfo.url;
    case "title":
      return fileInfo.permalink || `/${slugify(fileInfo.title)}`;
    case "filePath":
    default:
      return fileInfo.url;
  }
}

/**
 * 在文件索引中查找文件
 */
export function findFile(filename: string, fileIndex: FileIndex, currentFilePath?: string): FileInfo | undefined {
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
}

/**
 * 解析当前文件内的锚点链接
 */
export function resolveAnchorLink(parsed: ParsedWikilink, options: ObsidianWikilinkOptions): string {
  if (!parsed.isAnchorOnly || !parsed.heading) {
    return parsed.raw;
  }

  const anchor = headingToAnchor(parsed.heading);
  const text = parsed.displayText || parsed.heading;

  return `[${text}](#${anchor})`;
}

/**
 * 转换 Wikilink 为标准 Markdown 链接
 *
 * @param text 包含 Wikilink 的文本
 * @param fileIndex 文件索引
 * @param currentFilePath 当前文件路径
 * @param options 插件选项
 * @returns 转换后的文本
 */
export function convertWikilinkText(
  text: string,
  fileIndex: FileIndex,
  currentFilePath: string,
  options: ObsidianWikilinkOptions
): string {
  const {
    resolveMode = "filePath",
    imageDir = "/attachments",
    imageExtensions = DEFAULT_IMAGE_EXTENSIONS,
    warnOnNotFound = true,
    onNotFound = "keep",
    placeholderTemplate = "[未找到: {filename}]",
  } = options;

  // 查找所有 Wikilink
  const wikilinkRegex = /(!?)\[\[([^\]]+)\]\]/g;

  return text.replace(wikilinkRegex, match => {
    const parsed = parseWikilink(match, imageExtensions);

    if (!parsed) return match;

    // 处理纯锚点链接
    if (parsed.isAnchorOnly) {
      return resolveAnchorLink(parsed, options);
    }

    // 查找目标文件
    const fileInfo = findFile(parsed.filename, fileIndex, currentFilePath);

    if (!fileInfo) {
      // 检查是否为图片（在 imageDir 中）
      if (parsed.isImage || isImageFile(parsed.filename, imageExtensions)) {
        const imageUrl = `${imageDir}/${parsed.filename}`;
        const alt = parsed.displayText || basename(parsed.filename, extname(parsed.filename));
        return `![${alt}](${imageUrl})`;
      }

      // 未找到文件
      if (warnOnNotFound) {
        log.warn(`未找到文件: ${parsed.filename}`);
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

    // 构建 Markdown 链接
    return buildMarkdownLink(parsed, targetUrl, options);
  });
}

/**
 * 批量转换文件中的 Wikilinks
 *
 * @param content 文件内容
 * @param fileIndex 文件索引
 * @param currentFilePath 当前文件路径
 * @param options 插件选项
 * @returns 转换后的内容
 */
export function convertWikilinks(
  content: string,
  fileIndex: FileIndex,
  currentFilePath: string,
  options: ObsidianWikilinkOptions
): string {
  // 转换内容中的 Wikilinks
  return convertWikilinkText(content, fileIndex, currentFilePath, options);
}
