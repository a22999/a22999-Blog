/**
 * TitleTag 类型
 */
export type TitleTagType =
  | "vp-primary"
  | "vp-info"
  | "vp-success"
  | "vp-warning"
  | "vp-danger"
  | "vp-important"
  | "ep-primary"
  | "ep-info"
  | "ep-success"
  | "ep-warning"
  | "ep-danger";

/**
 * TitleTag 位置
 */
export type TitleTagPosition = "left" | "right";

/**
 * TitleTag 大小
 */
export type TitleTagSize = "large" | "default" | "small" | "mini";

/**
 * TitleTag Props 类型
 */
export interface TitleTagProps {
  /**
   * 内容
   */
  text?: string;
  /**
   * 类型
   */
  type?: TitleTagType;
  /**
   * 位置
   */
  position?: TitleTagPosition;
  /**
   * 大小
   */
  size?: TitleTagSize;
}
