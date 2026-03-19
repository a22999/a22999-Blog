/**
 * 标签云动画配置
 */
export interface TagCloudAnimation {
  /**
   * 是否启用动画效果
   * @default true
   */
  enabled?: boolean;
  /**
   * 是否启用悬停缩放动画
   * @default true
   */
  hoverScale?: boolean;
  /**
   * 是否启用悬停发光效果
   * @default false
   */
  hoverGlow?: boolean;
  /**
   * 是否启用选中过渡动画
   * @default true
   */
  selectTransition?: boolean;
  /**
   * 是否启用呼吸动画（标签云整体轻微浮动）
   * @default false
   */
  breathing?: boolean;
  /**
   * 呼吸动画持续时间（秒）
   * @default 3
   */
  breathingDuration?: number;
}

/**
 * 时间线展示模式配置
 */
export interface TagTimelineConfig {
  /**
   * 时间线样式：'default' | 'dot' | 'card'
   * @default 'default'
   */
  style?: "default" | "dot" | "card";
  /**
   * 是否显示时间线连接线
   * @default true
   */
  showLine?: boolean;
  /**
   * 是否显示年份分组
   * @default true
   */
  showYearGroup?: boolean;
  /**
   * 时间线方向：'vertical' | 'horizontal'
   * @default 'vertical'
   */
  direction?: "vertical" | "horizontal";
}

export interface Tag {
  /**
   * 是否启用标签卡片
   *
   * @default true
   */
  enabled?: boolean;
  /**
   * 标签页访问地址
   *
   * @default '/tags'
   */
  path?: string;
  /**
   * 标签页页卡片标题
   *
   * @default '${svg}全部标签'
   */
  pageTitle?: string | ((icon: string) => string);
  /**
   * 卡片标题
   *
   * @default '${svg}热门标签'
   */
  homeTitle?: string | ((icon: string) => string);
  /**
   * 查看更多分类标签
   *
   * @default '更多 ...'
   */
  moreLabel?: string;
  /**
   * 标签为空时的标签
   *
   * @default '暂无标签'
   */
  emptyLabel?: string;
  /**
   * 一页显示的数量
   *
   * @default 21
   */
  limit?: number;
  /**
   * 是否自动翻页
   *
   * @default false
   */
  autoPage?: boolean;
  /**
   * 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
   *
   * @default 4000 (4秒)
   */
  pageSpeed?: number;
  /**
   * 标签选择器页面配置
   */
  tagsPage?: {
    /**
     * 页面标题
     * @default '{icon}全部标签'
     */
    title?: string | ((icon: string) => string);
    /**
     * 展示模式：'cloud' | 'list' | 'group' | 'timeline'
     * @default 'cloud'
     */
    displayMode?: "cloud" | "list" | "group" | "timeline";
    /**
     * 是否显示文章数量
     * @default true
     */
    showCount?: boolean;
    /**
     * 标签排序方式：'count' | 'name' | 'date'
     * @default 'count'
     */
    sortBy?: "count" | "name" | "date";
    /**
     * 标签云模式下的最小字体大小（px）
     * @default 12
     */
    cloudMinSize?: number;
    /**
     * 标签云模式下的最大字体大小（px）
     * @default 24
     */
    cloudMaxSize?: number;
    /**
     * 空状态文案
     * @default '暂无标签'
     */
    emptyLabel?: string;
    /**
     * 标签云动画配置
     */
    cloudAnimation?: TagCloudAnimation;
    /**
     * 时间线模式配置
     */
    timeline?: TagTimelineConfig;
    /**
     * 是否启用键盘导航
     * @default true
     */
    keyboardNavigation?: boolean;
  };
}
