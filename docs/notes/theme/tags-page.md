---
date: 2026-03-19 09:34:25
title: tags-page
permalink: /274e72
categories:
  - notes
  - theme
---

# 标签页面 (Tags Page)

## 功能介绍

标签页面是 Teek 主题的核心功能之一，用于展示博客中所有标签，并支持通过标签筛选文章。该功能提供了丰富的配置选项，包括多种展示模式、搜索过滤、样式定制等。

### 主要特性

- **多种展示模式**：支持云状模式（cloud）、列表模式（list）、分组模式（group）、时间线模式（timeline）四种展示风格
- **标签搜索**：内置搜索功能，可快速定位目标标签
- **文章筛选联动**：点击标签自动筛选相关文章列表
- **灵活排序**：支持按文章数量、名称、日期等多种方式排序
- **自定义样式**：支持自定义标签颜色、字体大小等样式
- **国际化支持**：内置中英文语言包，支持自定义文案

## 基础用法

### 创建标签页面

在项目中创建 `tagsPage.md` 文件，内容如下：

```markdown
---
title: 标签
permalink: /tags
tagsPage: true
article: false
layout: home
---
```

### 基础配置

在 `teekConfig.ts` 中配置标签页面：

```typescript
import { defineTeekConfig } from "vitepress-theme-teek/config";

export default defineTeekConfig({
  tag: {
    enabled: true, // 启用标签卡片
    path: "/tags", // 标签页访问地址
    pageTitle: "${icon}全部标签", // 标签页标题
    homeTitle: "${icon}热门标签", // 首页卡片标题
    moreLabel: "更多 ...", // 查看更多按钮文案
    emptyLabel: "暂无标签", // 空状态文案
    limit: 21, // 首页卡片显示数量
    autoPage: false, // 是否自动翻页
    pageSpeed: 4000, // 翻页间隔时间（毫秒）
  },
});
```

## 展示模式

标签页面支持四种展示模式，通过 `tagsPage.displayMode` 配置。

### 云状模式 (cloud)

云状模式是默认模式，标签以不同大小的字体展示，字体大小与文章数量成正比。适合标签数量较多且希望突出热门标签的场景。

```typescript
export default defineTeekConfig({
  tag: {
    tagsPage: {
      displayMode: "cloud",
      cloudMinSize: 12, // 最小字体大小（px）
      cloudMaxSize: 24, // 最大字体大小（px）
      showCount: true, // 是否显示文章数量
    },
  },
});
```

**特点：**

- 标签大小反映文章数量，热门标签更加醒目
- 居中对齐排列，视觉效果美观
- 支持自定义字体大小范围

### 列表模式 (list)

列表模式将标签以统一大小的列表形式展示，适合标签数量较少或希望整齐展示的场景。

```typescript
export default defineTeekConfig({
  tag: {
    tagsPage: {
      displayMode: "list",
      showCount: true, // 是否显示文章数量
    },
  },
});
```

**特点：**

- 标签大小一致，整齐划一
- 左对齐排列，便于浏览
- 文章数量显示为独立徽章

### 分组模式 (group)

分组模式按照标签首字母进行分组展示，适合标签数量较多且希望快速定位的场景。

```typescript
export default defineTeekConfig({
  tag: {
    tagsPage: {
      displayMode: "group",
      showCount: true, // 是否显示文章数量
    },
  },
});
```

**特点：**

- 按首字母 A-Z 分组，数字和特殊字符归为 `#` 组
- 左侧显示字母索引，右侧显示对应标签
- 便于快速查找特定标签

### 时间线模式 (timeline)

时间线模式按时间顺序展示标签，适合展示标签的创建或更新时间线。

```typescript
export default defineTeekConfig({
  tag: {
    tagsPage: {
      displayMode: "timeline",
      showCount: true,
      timeline: {
        style: "default", // 时间线样式：default | dot | card
        showLine: true, // 是否显示连接线
        showYearGroup: true, // 是否显示年份分组
        direction: "vertical", // 时间线方向：vertical | horizontal
      },
    },
  },
});
```

**特点：**

- 按时间顺序排列标签
- 支持年份分组展示
- 可选多种时间线样式

## 配置选项

### 标签卡片配置 (tag)

| 配置项       | 类型                                   | 默认值             | 说明                   |
| ------------ | -------------------------------------- | ------------------ | ---------------------- |
| `enabled`    | `boolean`                              | `true`             | 是否启用标签卡片       |
| `path`       | `string`                               | `'/tags'`          | 标签页访问地址         |
| `pageTitle`  | `string \| ((icon: string) => string)` | `'{icon}全部标签'` | 标签页标题             |
| `homeTitle`  | `string \| ((icon: string) => string)` | `'{icon}热门标签'` | 首页卡片标题           |
| `moreLabel`  | `string`                               | `'更多 ...'`       | 查看更多按钮文案       |
| `emptyLabel` | `string`                               | `'暂无标签'`       | 标签为空时的提示文案   |
| `limit`      | `number`                               | `21`               | 首页卡片一页显示的数量 |
| `autoPage`   | `boolean`                              | `false`            | 是否自动翻页           |
| `pageSpeed`  | `number`                               | `4000`             | 翻页间隔时间（毫秒）   |

### 标签页面配置 (tag.tagsPage)

| 配置项               | 类型                                         | 默认值             | 说明                       |
| -------------------- | -------------------------------------------- | ------------------ | -------------------------- |
| `title`              | `string \| ((icon: string) => string)`       | `'{icon}全部标签'` | 页面标题                   |
| `displayMode`        | `'cloud' \| 'list' \| 'group' \| 'timeline'` | `'cloud'`          | 展示模式                   |
| `showCount`          | `boolean`                                    | `true`             | 是否显示文章数量           |
| `sortBy`             | `'count' \| 'name' \| 'date'`                | `'count'`          | 标签排序方式               |
| `cloudMinSize`       | `number`                                     | `12`               | 云状模式最小字体大小（px） |
| `cloudMaxSize`       | `number`                                     | `24`               | 云状模式最大字体大小（px） |
| `emptyLabel`         | `string`                                     | `'暂无标签'`       | 空状态文案                 |
| `cloudAnimation`     | `TagCloudAnimation`                          | -                  | 标签云动画配置             |
| `timeline`           | `TagTimelineConfig`                          | -                  | 时间线模式配置             |
| `keyboardNavigation` | `boolean`                                    | `true`             | 是否启用键盘导航           |

### 标签云动画配置 (cloudAnimation)

| 配置项              | 类型      | 默认值  | 说明                   |
| ------------------- | --------- | ------- | ---------------------- |
| `enabled`           | `boolean` | `true`  | 是否启用动画效果       |
| `hoverScale`        | `boolean` | `true`  | 是否启用悬停缩放动画   |
| `hoverGlow`         | `boolean` | `false` | 是否启用悬停发光效果   |
| `selectTransition`  | `boolean` | `true`  | 是否启用选中过渡动画   |
| `breathing`         | `boolean` | `false` | 是否启用呼吸动画       |
| `breathingDuration` | `number`  | `3`     | 呼吸动画持续时间（秒） |

### 时间线模式配置 (timeline)

| 配置项          | 类型                           | 默认值       | 说明             |
| --------------- | ------------------------------ | ------------ | ---------------- |
| `style`         | `'default' \| 'dot' \| 'card'` | `'default'`  | 时间线样式       |
| `showLine`      | `boolean`                      | `true`       | 是否显示连接线   |
| `showYearGroup` | `boolean`                      | `true`       | 是否显示年份分组 |
| `direction`     | `'vertical' \| 'horizontal'`   | `'vertical'` | 时间线方向       |

### 排序方式说明

| 排序值    | 说明                       |
| --------- | -------------------------- |
| `'count'` | 按文章数量降序排列（默认） |
| `'name'`  | 按标签名称字母顺序排列     |
| `'date'`  | 按创建日期排列             |

## 样式定制

### 自定义标签颜色

通过 `tagColor` 配置项自定义标签的背景色、文字颜色和边框色：

```typescript
export default defineTeekConfig({
  tagColor: [
    { border: "#bfdbfe", bg: "#eff6ff", text: "#2563eb" },
    { border: "#e9d5ff", bg: "#faf5ff", text: "#9333ea" },
    { border: "#fbcfe8", bg: "#fdf2f8", text: "#db2777" },
    { border: "#a7f3d0", bg: "#ecfdf5", text: "#059669" },
    { border: "#fde68a", bg: "#fffbeb", text: "#d97706" },
    { border: "#a5f3fc", bg: "#ecfeff", text: "#0891b2" },
    { border: "#c7d2fe", bg: "#eef2ff", text: "#4f46e5" },
  ],
});
```

颜色会按顺序循环应用到各个标签上。

### 通过 CSS 覆盖样式

可以通过覆盖 CSS 变量或直接修改类名样式来自定义外观：

```css
/* 修改标签项样式 */
.tk-tags-page__tag-item {
  border-radius: 8px;
}

/* 修改云状模式容器 */
.tk-tags-page__cloud {
  padding: 32px;
  background-color: var(--vp-c-bg-soft);
}

/* 修改分组模式字母索引 */
.tk-tags-page__group-letter {
  width: 48px;
  height: 48px;
  font-size: 24px;
}

/* 修改搜索框样式 */
.tk-tags-page__search {
  border-radius: 12px;
}

/* 修改选中状态提示 */
.tk-tags-page__selected {
  border-radius: 12px;
}
```

## 示例代码

### 基础配置示例

```typescript
// docs/.vitepress/teekConfig.ts
import { defineTeekConfig } from "vitepress-theme-teek/config";

export default defineTeekConfig({
  tag: {
    enabled: true,
    path: "/tags",
    homeTitle: "${icon}热门标签",
    moreLabel: "查看全部",
    limit: 15,
  },
});
```

### 云状模式完整配置

```typescript
import { defineTeekConfig } from "vitepress-theme-teek/config";

export default defineTeekConfig({
  tag: {
    enabled: true,
    path: "/tags",
    pageTitle: "${icon}标签云",
    homeTitle: "${icon}热门标签",
    moreLabel: "更多标签...",
    emptyLabel: "暂无标签内容",
    limit: 21,
    autoPage: false,
    tagsPage: {
      title: "探索标签",
      displayMode: "cloud",
      showCount: true,
      sortBy: "count",
      cloudMinSize: 14,
      cloudMaxSize: 28,
    },
  },
  tagColor: [
    { border: "#bfdbfe", bg: "#eff6ff", text: "#2563eb" },
    { border: "#e9d5ff", bg: "#faf5ff", text: "#9333ea" },
    { border: "#fbcfe8", bg: "#fdf2f8", text: "#db2777" },
  ],
});
```

### 列表模式配置

```typescript
import { defineTeekConfig } from "vitepress-theme-teek/config";

export default defineTeekConfig({
  tag: {
    enabled: true,
    tagsPage: {
      displayMode: "list",
      showCount: true,
      sortBy: "name", // 按名称排序
    },
  },
});
```

### 分组模式配置

```typescript
import { defineTeekConfig } from "vitepress-theme-teek/config";

export default defineTeekConfig({
  tag: {
    enabled: true,
    tagsPage: {
      displayMode: "group",
      showCount: true,
      sortBy: "name", // 按名称排序，便于分组查看
    },
  },
});
```

### 时间线模式配置

```typescript
import { defineTeekConfig } from "vitepress-theme-teek/config";

export default defineTeekConfig({
  tag: {
    enabled: true,
    tagsPage: {
      displayMode: "timeline",
      showCount: true,
      sortBy: "date", // 按日期排序
      timeline: {
        style: "card", // 使用卡片样式
        showLine: true,
        showYearGroup: true,
        direction: "vertical",
      },
    },
  },
});
```

### 标签云动画配置

```typescript
import { defineTeekConfig } from "vitepress-theme-teek/config";

export default defineTeekConfig({
  tag: {
    tagsPage: {
      displayMode: "cloud",
      cloudAnimation: {
        enabled: true,
        hoverScale: true,
        hoverGlow: true, // 启用悬停发光效果
        selectTransition: true,
        breathing: true, // 启用呼吸动画
        breathingDuration: 4, // 呼吸动画周期 4 秒
      },
    },
  },
});
```

### 函数式标题配置

支持使用函数动态生成标题：

```typescript
import { defineTeekConfig } from "vitepress-theme-teek/config";

export default defineTeekConfig({
  tag: {
    pageTitle: icon => `${icon} 标签总览`,
    homeTitle: icon => `${icon} 热门标签推荐`,
    tagsPage: {
      title: icon => `${icon} 发现精彩内容`,
    },
  },
});
```

### 完整配置示例

```typescript
import { defineTeekConfig } from "vitepress-theme-teek/config";

export default defineTeekConfig({
  // 标签基础配置
  tag: {
    enabled: true,
    path: "/tags",
    pageTitle: "${icon}全部标签",
    homeTitle: "${icon}热门标签",
    moreLabel: "更多 ...",
    emptyLabel: "暂无标签",
    limit: 21,
    autoPage: false,
    pageSpeed: 4000,

    // 标签页面详细配置
    tagsPage: {
      title: "探索标签",
      displayMode: "cloud",
      showCount: true,
      sortBy: "count",
      cloudMinSize: 14,
      cloudMaxSize: 28,
      emptyLabel: "暂无标签内容",
      keyboardNavigation: true,

      // 标签云动画
      cloudAnimation: {
        enabled: true,
        hoverScale: true,
        hoverGlow: false,
        selectTransition: true,
        breathing: false,
        breathingDuration: 3,
      },

      // 时间线配置（当 displayMode 为 timeline 时生效）
      timeline: {
        style: "default",
        showLine: true,
        showYearGroup: true,
        direction: "vertical",
      },
    },
  },

  // 标签颜色配置
  tagColor: [
    { border: "#bfdbfe", bg: "#eff6ff", text: "#2563eb" },
    { border: "#e9d5ff", bg: "#faf5ff", text: "#9333ea" },
    { border: "#fbcfe8", bg: "#fdf2f8", text: "#db2777" },
    { border: "#a7f3d0", bg: "#ecfdf5", text: "#059669" },
    { border: "#fde68a", bg: "#fffbeb", text: "#d97706" },
  ],
});
```

### 与文章列表联动

标签页面支持与文章列表联动筛选。当用户点击标签时：

1. 如果当前不在标签页，会自动跳转到标签页并带上筛选参数
2. 如果已在标签页，URL 会更新筛选参数，文章列表会自动刷新

URL 格式：`/tags?tag=Vue&pageNum=1`

用户也可以通过搜索框快速查找标签，支持以下键盘快捷操作：

- `Enter`：选中当前高亮的标签
- `Escape`：清除搜索内容

## 国际化

标签页面内置中英文语言包，可根据 VitePress 的语言配置自动切换。

### 中文默认值

```typescript
{
  tagsPage: {
    title: "{icon}全部标签",
    totalCount: "共 {count} 个标签",
    empty: "暂无标签",
    label: "标签页",
    selected: "当前筛选：{tag}",
    clear: "清除筛选",
    searchPlaceholder: "搜索标签...",
    noResult: "未找到匹配的标签",
  },
}
```

### 英文默认值

```typescript
{
  tagsPage: {
    title: "{icon}All Tags",
    totalCount: "Total {count} tags",
    empty: "No tags",
    // ...
  },
}
```

### 自定义国际化文案

在 `locales` 配置中添加自定义文案：

```typescript
// docs/.vitepress/config.ts
export default defineConfig({
  locales: {
    "zh-CN": {
      label: "简体中文",
      lang: "zh-CN",
      themeConfig: {
        locale: {
          tagsPage: {
            title: "{icon} 标签集合",
            searchPlaceholder: "输入关键词搜索...",
            noResult: "没有找到相关标签",
          },
        },
      },
    },
  },
});
```

## 注意事项

1. **frontmatter 配置**：标签页面 Markdown 文件需要设置 `tagsPage: true` 和 `layout: home`
2. **文章标签**：确保文章的 frontmatter 中包含 `tags` 字段，格式为数组
3. **排序优先级**：云状模式推荐使用 `count` 排序以突出热门标签，分组模式推荐使用 `name` 排序以便分组
4. **移动端适配**：四种展示模式均支持响应式布局，在移动端有优化的显示效果
