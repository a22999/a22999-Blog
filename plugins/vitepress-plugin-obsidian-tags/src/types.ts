import type { GlobOptions } from "tinyglobby";

/**
 * Obsidian 标签插件配置选项
 */
export interface ObsidianTagsOptions {
  /**
   * 扫描的文件路径表达式，为 global 表达式
   */
  pattern?: string | string[];
  /**
   * 是否提取正文中的 #tag 标签
   * @default true
   */
  extractInlineTags?: boolean;
  /**
   * 是否将提取的标签合并到 frontmatter 的 tags 字段
   * @default true
   */
  mergeToFrontmatter?: boolean;
  /**
   * 是否将正文中的 #tag 转换为链接
   * @default false
   */
  convertToLinks?: boolean;
  /**
   * 标签页路径，用于生成标签链接
   * @default "/tags"
   */
  tagsPagePath?: string;
  /**
   * 只提取特定前缀的标签，例如 ["blog/", "project/"]
   * 如果不设置，则提取所有标签
   */
  tagPrefixes?: string[];
  /**
   * 排除特定前缀的标签
   */
  excludeTagPrefixes?: string[];
  /**
   * 标签白名单，只提取列表中的标签
   */
  includeTags?: string[];
  /**
   * 标签黑名单，排除列表中的标签
   */
  excludeTags?: string[];
  /**
   * tinyglobby 的配置项
   * 插件默认已经忽略 node_modules 和 dist 目录的所有文件
   */
  globOptions?: GlobOptions;
  /**
   * 转换标签名称的函数
   * 例如：将标签名转为小写
   */
  transformTag?: (tag: string) => string;
  /**
   * 自定义标签链接生成函数
   * @param tag 标签名
   * @param tagsPagePath 标签页路径
   * @returns 标签链接 URL
   */
  generateTagLink?: (tag: string, tagsPagePath: string) => string;
  /**
   * 是否在控制台输出详细日志
   * @default false
   */
  debug?: boolean;
}

/**
 * 标签提取结果
 */
export interface TagExtractionResult {
  /**
   * 提取的标签列表（去重后）
   */
  tags: string[];
  /**
   * 从 frontmatter 中获取的原始标签
   */
  frontmatterTags: string[];
  /**
   * 从正文中提取的标签
   */
  inlineTags: string[];
}

/**
 * 标签转换结果
 */
export interface TagConversionResult {
  /**
   * 转换后的内容
   */
  content: string;
  /**
   * 转换的标签数量
   */
  convertedCount: number;
}
