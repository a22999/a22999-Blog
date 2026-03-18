/**
 * Vue 组件类型（通用定义）
 */
export type VueComponent = {
  __isVueComponent?: true;
  setup?: (...args: any[]) => any;
  render?: (...args: any[]) => any;
  template?: string;
} & Record<string, any>;

/**
 * Iconify 图标类型（通用定义）
 */
export type IconifyIconLike = {
  body?: string;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  rotate?: number;
  hFlip?: boolean;
  vFlip?: boolean;
} & Record<string, any>;

/**
 * 图标类型
 */
export type IconType =
  | "svg"
  | "unicode"
  | "iconfont"
  | "symbol"
  | "img"
  | "component"
  | "iconifyOffline"
  | "iconifyOnline";

/**
 * 图标 Props 类型
 */
export interface IconProps {
  /**
   * 图标
   */
  icon?: string | VueComponent | IconifyIconLike | Record<string, any>;
  /**
   * 图标类型
   */
  iconType?: IconType;
  /**
   * 图标大小
   *
   * @default 'inherit'
   */
  size?: string | number;
  /**
   * 图标颜色
   *
   * @default 'inherit'
   */
  color?: string;
  /**
   * 图标是否可悬停
   *
   * @default false
   */
  hover?: boolean;
  /**
   * 图标悬停时的颜色，仅当 hover 为 true 时有效
   *
   * @default 'var(--tk-theme-color)'
   */
  hoverColor?: string;
  /**
   * img 标签的 alt，当 iconType 为 img 时生效
   */
  imgAlt?: string;
  /**
   * 是否使用鼠标手形
   */
  pointer?: boolean;
  /**
   * 自定义图标样式
   */
  style?: Record<string, any>;
}
