/**
 * 主题模式
 */
export type ThemeMode = "light" | "dark" | "auto";

/**
 * 主题色彩配置
 */
export interface ThemeColor {
  /**
   * 主色调
   */
  primary?: string;
  /**
   * 成功色
   */
  success?: string;
  /**
   * 警告色
   */
  warning?: string;
  /**
   * 危险色
   */
  danger?: string;
  /**
   * 信息色
   */
  info?: string;
}

/**
 * 主题过渡配置
 */
export interface ThemeTransition {
  /**
   * 是否启用过渡动画
   *
   * @default true
   */
  enabled?: boolean;
  /**
   * 过渡持续时间（毫秒）
   *
   * @default 300
   */
  duration?: number;
}

/**
 * 主题配置
 */
export interface ThemeConfig {
  /**
   * 主题模式
   *
   * @default 'auto'
   */
  mode?: ThemeMode;
  /**
   * 主题色彩配置
   */
  color?: ThemeColor;
  /**
   * 过渡配置
   */
  transition?: ThemeTransition;
  /**
   * 是否启用暗黑模式切换按钮
   *
   * @default true
   */
  darkModeToggle?: boolean;
  /**
   * 是否启用主题色选择器
   *
   * @default false
   */
  colorPicker?: boolean;
}
