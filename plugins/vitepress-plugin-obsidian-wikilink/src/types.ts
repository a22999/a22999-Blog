/**
 * Wikilinks 解析模式
 */
export type ResolveMode = "permalink" | "filePath" | "title";

/**
 * 未找到文件时的处理方式
 */
export type NotFoundBehavior = "keep" | "remove" | "placeholder";

/**
 * 文件信息
 */
export interface FileInfo {
  /**
   * 文件相对路径（相对于 srcDir）
   */
  relativePath: string;
  /**
   * 文件访问 URL
   */
  url: string;
  /**
   * 文件名（不含扩展名）
   */
  filename: string;
  /**
   * 文件标题（来自 frontmatter.title 或文件名）
   */
  title: string;
  /**
   * 文件的 permalink（如果有）
   */
  permalink?: string;
  /**
   * frontmatter 数据
   */
  frontmatter: Record<string, any>;
}

/**
 * 解析后的 Wikilink 信息
 */
export interface ParsedWikilink {
  /**
   * 原始文本
   */
  raw: string;
  /**
   * 是否为嵌入语法（以 ! 开头）
   */
  isEmbed: boolean;
  /**
   * 文件名（不含路径和扩展名）
   */
  filename: string;
  /**
   * 显示文本（如果有）
   */
  displayText?: string;
  /**
   * 标题锚点（如果有）
   */
  heading?: string;
  /**
   * 是否为图片
   */
  isImage: boolean;
  /**
   * 是否为当前文件内锚点（只有 #heading）
   */
  isAnchorOnly: boolean;
}

/**
 * Obsidian Wikilink 插件配置选项
 */
export interface ObsidianWikilinkOptions {
  /**
   * 链接解析模式
   * - permalink: 使用文章的 permalink 作为链接
   * - filePath: 使用文件相对路径
   * - title: 使用标题 slug 化后的路径
   *
   * @default 'filePath'
   */
  resolveMode?: ResolveMode;

  /**
   * 图片目录，用于解析图片链接
   *
   * @default '/attachments'
   */
  imageDir?: string;

  /**
   * 未找到文件时的处理方式
   * - keep: 保留原始 Wikilink 语法
   * - remove: 移除该链接
   * - placeholder: 替换为占位符文本
   *
   * @default 'keep'
   */
  onNotFound?: NotFoundBehavior;

  /**
   * 占位符文本模板，当 onNotFound 为 'placeholder' 时使用
   * 支持变量: {filename}
   *
   * @default '[未找到: {filename}]'
   */
  placeholderTemplate?: string;

  /**
   * 忽略的文件路径，支持正则表达式
   *
   * @default []
   */
  ignoreList?: Array<RegExp | string>;

  /**
   * 图片文件扩展名列表
   *
   * @default ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'ico']
   */
  imageExtensions?: string[];

  /**
   * 是否在控制台显示未找到文件的警告
   *
   * @default true
   */
  warnOnNotFound?: boolean;

  /**
   * 扫描 Markdown 文件的 glob 模式
   *
   * @default '**/*.md'
   */
  filePattern?: string | string[];
}

/**
 * 文件索引
 */
export type FileIndex = Map<string, FileInfo>;
