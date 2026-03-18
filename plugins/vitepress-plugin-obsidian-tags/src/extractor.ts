import type { ObsidianTagsOptions, TagExtractionResult } from "./types";

/**
 * 检查位置是否在代码块内
 */
const isPositionInCodeBlock = (content: string, position: number): boolean => {
  const lines = content.substring(0, position).split("\n");
  let inCodeBlock = false;
  let inInlineCode = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let j = 0;

    while (j < line.length) {
      // 检查行内代码（单个反引号）
      if (line[j] === "`" && !inCodeBlock) {
        // 检查是否是代码块开始（三个反引号）
        if (line.substring(j, j + 3) === "```") {
          inCodeBlock = !inCodeBlock;
          j += 3;
          continue;
        }
        inInlineCode = !inInlineCode;
      }
      j++;
    }

    // 如果是最后一行，检查位置
    if (i === lines.length - 1) {
      return inCodeBlock || inInlineCode;
    }
  }

  return inCodeBlock || inInlineCode;
};

/**
 * 检查位置是否在行首（排除 Markdown 标题）
 */
const isAtLineStart = (content: string, position: number): boolean => {
  // 找到当前位置之前的最后一个换行符
  let lastNewline = content.lastIndexOf("\n", position - 1);
  if (lastNewline === -1) lastNewline = 0;
  else lastNewline++; // 移动到换行符后的第一个字符

  // 检查从换行符到当前位置之间是否只有空格
  const betweenContent = content.substring(lastNewline, position);
  return betweenContent.trim() === "";
};

/**
 * 检查是否是 HTML 实体（如 #xff0c）
 */
const isHtmlEntity = (content: string, position: number): boolean => {
  const afterHash = content.substring(position + 1, position + 6);
  return /^x[0-9a-fA-F]+/.test(afterHash);
};

/**
 * 检查是否是有效的标签字符
 * 支持中文、英文、数字、下划线、连字符、斜杠
 */
const isValidTagChar = (char: string): boolean => {
  return /[\u4e00-\u9fa5a-zA-Z0-9_\-\/]/.test(char);
};

/**
 * 提取单个标签
 */
const extractSingleTag = (content: string, position: number): { tag: string; endPosition: number } | null => {
  // 跳过 # 号
  let tagStart = position + 1;
  let tagEnd = tagStart;

  // 检查第一个字符是否有效
  if (tagStart >= content.length || !isValidTagChar(content[tagStart])) {
    return null;
  }

  // 提取标签名
  while (tagEnd < content.length && isValidTagChar(content[tagEnd])) {
    tagEnd++;
  }

  const tag = content.substring(tagStart, tagEnd);

  // 标签至少需要一个字符
  if (tag.length === 0) {
    return null;
  }

  return { tag, endPosition: tagEnd };
};

/**
 * 验证标签是否符合配置要求
 */
const validateTag = (
  tag: string,
  options: Pick<ObsidianTagsOptions, "tagPrefixes" | "excludeTagPrefixes" | "includeTags" | "excludeTags">
): boolean => {
  // 检查黑名单
  if (options.excludeTags && options.excludeTags.includes(tag)) {
    return false;
  }

  // 检查白名单（如果设置了白名单，则只允许白名单中的标签）
  if (options.includeTags && !options.includeTags.includes(tag)) {
    return false;
  }

  // 检查排除前缀
  if (options.excludeTagPrefixes) {
    for (const prefix of options.excludeTagPrefixes) {
      if (tag.startsWith(prefix)) {
        return false;
      }
    }
  }

  // 检查包含前缀（如果设置了前缀，则只提取特定前缀的标签）
  if (options.tagPrefixes && options.tagPrefixes.length > 0) {
    const matchesPrefix = options.tagPrefixes.some(prefix => tag.startsWith(prefix));
    if (!matchesPrefix) {
      return false;
    }
  }

  return true;
};

/**
 * 从 Markdown 内容中提取 Obsidian 标签
 *
 * @param content Markdown 内容
 * @param frontmatterTags frontmatter 中的标签
 * @param options 插件配置选项
 * @returns 标签提取结果
 */
export const extractTags = (
  content: string,
  frontmatterTags: string[] = [],
  options: ObsidianTagsOptions = {}
): TagExtractionResult => {
  const inlineTags: string[] = [];
  const { extractInlineTags = true, transformTag } = options;

  if (!extractInlineTags) {
    return {
      tags: [...new Set(frontmatterTags)],
      frontmatterTags,
      inlineTags: [],
    };
  }

  // 找到正文内容（跳过 frontmatter）
  let bodyContent = content;
  const frontmatterMatch = content.match(/^---[\s\S]*?---/);
  if (frontmatterMatch) {
    bodyContent = content.substring(frontmatterMatch[0].length);
  }

  // 使用正则表达式快速找到所有可能的标签位置
  // 匹配 # 后面跟着中文、英文、数字、下划线、连字符或斜杠
  const tagPattern = /#[\u4e00-\u9fa5a-zA-Z0-9_\-\/]+/g;
  let match: RegExpExecArray | null;

  while ((match = tagPattern.exec(bodyContent)) !== null) {
    const position = match.index;
    const fullMatch = match[0];

    // 检查是否在代码块内
    if (isPositionInCodeBlock(bodyContent, position)) {
      continue;
    }

    // 检查是否是 Markdown 标题（行首的 # 后面跟着空格）
    if (isAtLineStart(bodyContent, position)) {
      // 检查后面是否跟着空格（标题格式）
      const charAfter = bodyContent.substring(position + fullMatch.length).trimStart()[0];
      if (bodyContent[position + 1] === " " || bodyContent[position + 1] === "\t") {
        continue;
      }
    }

    // 检查是否是 HTML 实体
    if (isHtmlEntity(bodyContent, position)) {
      continue;
    }

    // 检查 # 前面的字符，排除 URL 中的锚点
    if (position > 0) {
      const prevChar = bodyContent[position - 1];
      // 如果前面是字母或数字，可能是 URL 的一部分
      if (/[a-zA-Z0-9]/.test(prevChar)) {
        continue;
      }
    }

    // 提取标签名（去掉 # 号）
    let tag = fullMatch.substring(1);

    // 验证标签
    if (!validateTag(tag, options)) {
      continue;
    }

    // 应用标签转换
    if (transformTag) {
      tag = transformTag(tag);
    }

    // 去重添加
    if (tag && !inlineTags.includes(tag)) {
      inlineTags.push(tag);
    }
  }

  // 合并标签
  const allTags = [...new Set([...frontmatterTags, ...inlineTags])];

  return {
    tags: allTags,
    frontmatterTags,
    inlineTags,
  };
};

/**
 * 获取正文内容（去除 frontmatter）
 */
export const getBodyContent = (content: string): string => {
  const frontmatterMatch = content.match(/^---[\s\S]*?---/);
  if (frontmatterMatch) {
    return content.substring(frontmatterMatch[0].length);
  }
  return content;
};
