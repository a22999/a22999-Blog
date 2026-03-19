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
     * 展示模式：'cloud' | 'list' | 'group'
     * @default 'cloud'
     */
    displayMode?: "cloud" | "list" | "group";
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
  };
}
