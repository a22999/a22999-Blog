import type { ObsidianTagsOptions, TagConversionResult } from "./types";
import { isPositionInCodeBlock, isAtLineStart, isHtmlEntity, isValidTagChar, validateTag } from "./extractor";

/**
 * 生成默认的标签链接
 */
const defaultGenerateTagLink = (tag: string, tagsPagePath: string): string => {
  // 对标签进行 URL 编码
  const encodedTag = encodeURIComponent(tag);
  return `${tagsPagePath}?tag=${encodedTag}`;
};

/**
 * 将正文中的 #tag 转换为 Markdown 链接
 *
 * @param content Markdown 内容
 * @param options 插件配置选项
 * @returns 转换结果
 */
export const convertTagsToLinks = (
  content: string,
  options: ObsidianTagsOptions = {}
): TagConversionResult => {
  const {
    convertToLinks = false,
    tagsPagePath = "/tags",
    generateTagLink = defaultGenerateTagLink,
    transformTag,
    debug = false,
  } = options;

  if (!convertToLinks) {
    return { content, convertedCount: 0 };
  }

  // 找到正文内容（跳过 frontmatter）
  let frontmatterPart = "";
  let bodyContent = content;
  const frontmatterMatch = content.match(/^---[\s\S]*?---/);
  if (frontmatterMatch) {
    frontmatterPart = frontmatterMatch[0];
    bodyContent = content.substring(frontmatterMatch[0].length);
  }

  let convertedCount = 0;
  const result: string[] = [];
  let i = 0;

  while (i < bodyContent.length) {
    // 找到 # 符号
    if (bodyContent[i] === "#") {
      const position = i;

      // 检查是否在代码块内
      if (isPositionInCodeBlock(bodyContent, position)) {
        result.push(bodyContent[i]);
        i++;
        continue;
      }

      // 检查是否是 Markdown 标题（行首的 #）
      if (isAtLineStart(bodyContent, position)) {
        // 检查是否是标题格式（# 后面跟着空格）
        if (bodyContent[i + 1] === " " || bodyContent[i + 1] === "\t") {
          result.push(bodyContent[i]);
          i++;
          continue;
        }
      }

      // 检查是否是 HTML 实体
      if (isHtmlEntity(bodyContent, position)) {
        result.push(bodyContent[i]);
        i++;
        continue;
      }

      // 检查 # 前面的字符，排除 URL 中的锚点
      if (position > 0) {
        const prevChar = bodyContent[position - 1];
        if (/[a-zA-Z0-9]/.test(prevChar)) {
          result.push(bodyContent[i]);
          i++;
          continue;
        }
      }

      // 尝试提取标签
      let tagEnd = i + 1;
      while (tagEnd < bodyContent.length && isValidTagChar(bodyContent[tagEnd])) {
        tagEnd++;
      }

      const tag = bodyContent.substring(i + 1, tagEnd);

      // 验证标签
      if (tag.length > 0 && validateTag(tag, options)) {
        let finalTag = tag;
        if (transformTag) {
          finalTag = transformTag(tag);
        }

        // 生成标签链接
        const tagLink = generateTagLink(finalTag, tagsPagePath);

        // 检查这个位置是否已经被转换过（避免重复转换）
        // 通过检查前面是否已经有 `[` 来判断
        const needConvert = !(
          result.length > 0 &&
          result[result.length - 1] === "[" &&
          bodyContent.substring(i, tagEnd) === `#${finalTag}`
        );

        if (needConvert) {
          // 转换为链接格式：[#tag](/tags?tag=tag)
          result.push(`[#${finalTag}](${tagLink})`);
          convertedCount++;
          i = tagEnd;
          continue;
        }
      }

      result.push(bodyContent[i]);
      i++;
    } else {
      result.push(bodyContent[i]);
      i++;
    }
  }

  const newContent = frontmatterPart + result.join("");

  if (debug && convertedCount > 0) {
    console.log(`[obsidian-tags] Converted ${convertedCount} tags to links`);
  }

  return {
    content: newContent,
    convertedCount,
  };
};

/**
 * 检查内容中是否有需要转换的标签
 */
export const hasInlineTags = (content: string, options: ObsidianTagsOptions = {}): boolean => {
  const { extractInlineTags = true } = options;

  if (!extractInlineTags) {
    return false;
  }

  // 获取正文内容
  let bodyContent = content;
  const frontmatterMatch = content.match(/^---[\s\S]*?---/);
  if (frontmatterMatch) {
    bodyContent = content.substring(frontmatterMatch[0].length);
  }

  // 快速检查是否存在可能的标签
  const tagPattern = /#[\u4e00-\u9fa5a-zA-Z0-9_\-\/]+/;
  return tagPattern.test(bodyContent);
};
