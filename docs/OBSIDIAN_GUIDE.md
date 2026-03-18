---
date: 2026-03-18 11:14:13
title: OBSIDIAN_GUIDE
permalink: /ae613b
categories:
  - 
---
# Obsidian 文章管理规范

> 本文档定义了使用 Obsidian 管理博客文章的规范和规则

---

## 一、目录结构设计

### 1.1 项目目录结构

```
a22999-Blog/                       # 博客项目根目录
├── obsidian/                      # Obsidian 笔记目录
│   ├── 笔记/                      # 博客文章（同步到 docs/01.AI提效）
│   │   ├── 01.🛠️ 工具安装/
│   │   ├── 02.💼 办公提效/
│   │   └── 03.⚡ 提升产出/
│   ├── 附件/                      # 图片等附件（同步到 docs/public/attachments）
│   ├── .obsidian/                 # Obsidian 配置
│   └── .gitignore
├── docs/                          # VitePress 文档目录
│   ├── 01.AI提效/                 # 同步自 obsidian/笔记
│   ├── public/
│   │   └── attachments/           # 同步自 obsidian/附件
│   └── ...
└── scripts/
    └── sync-obsidian.js           # 同步脚本
```

### 1.2 同步规则

- `obsidian/笔记/` → `docs/01.AI提效/`
- `obsidian/附件/` → `docs/public/attachments/`
- 执行 `pnpm docs:build` 时自动同步

---

## 二、文章命名规则

### 2.1 文件命名格式

| 格式 | 示例 | 说明 |
|------|------|------|
| `标题.md` | `软件安装指南.md` | 推荐格式，标题即文件名 |
| `序号.标题.md` | `01.软件安装指南.md` | 带序号，用于排序 |
| `序号_标题.md` | `01_软件安装指南.md` | 下划线分隔 |

### 2.2 目录命名格式

| 格式 | 示例 | 说明 |
|------|------|------|
| `分类名/` | `工具安装/` | 简单分类 |
| `序号.分类名/` | `01.工具安装/` | 带序号分类 |

---

## 三、Frontmatter 规范

### 3.1 标准文章模板

```yaml
---
# === 必填字段 ===
title: 文章标题                      # 文章标题
tags: [tag1, tag2, tag3]            # 标签（Obsidian 格式）

# === 自动生成字段 ===
date: 2025-03-18                    # 创建日期（自动生成）
updated: 2025-03-18 12:00:00        # 更新时间（自动生成）

# === 可选字段 ===
aliases: [别名1, 别名2]              # Obsidian 别名
categories:                         # 分类层级
  - 一级分类
  - 二级分类
permalink: /custom/url/path         # 永久链接
coverImg: /attachments/cover.png    # 封面图
sticky: 0                           # 置顶权重（数字越小越靠前）
titleTag: 标签                      # 标题标签
description: 文章描述               # SEO 描述
publish: true                       # 是否发布（false 为草稿）
---
```

### 3.2 目录页模板

```yaml
---
title: AI提效
date: 2025-03-18
permalink: /ai-efficiency
layout: page
catalogue: true                      # 标识为目录页
path: AI提效                         # 扫描路径
desc: AI时代下的工作效率革命
sidebar: false
article: false
categories:
  - AI提效
---
```

### 3.3 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | ✅ | 文章标题，默认使用文件名 |
| `tags` | string[] | ✅ | 标签数组，支持从正文 `#tag` 自动提取 |
| `date` | string | 自动 | 创建时间，格式 `YYYY-MM-DD` 或 `YYYY-MM-DD HH:mm:ss` |
| `updated` | string | 自动 | 更新时间 |
| `categories` | string[] | 可选 | 分类层级，默认从目录路径提取 |
| `permalink` | string | 可选 | 永久链接，不设置则自动生成 |
| `coverImg` | string | 可选 | 封面图片路径 |
| `sticky` | number | 可选 | 置顶权重，0 为不置顶 |
| `publish` | boolean | 可选 | 是否发布，默认 `true` |
| `aliases` | string[] | 可选 | Obsidian 别名，用于 Wikilinks |

---

## 四、Wikilinks 语法

### 4.1 支持的语法

| 语法 | 转换后 | 说明 |
|------|--------|------|
| `[[文件名]]` | `[文件名](/path/to/file)` | 基本链接 |
| `[[文件名\|显示文本]]` | `[显示文本](/path/to/file)` | 自定义显示文本 |
| `[[文件名#标题]]` | `[文件名#标题](/path/to/file#标题)` | 链接到特定标题 |
| `[[#标题]]` | `[标题](#标题)` | 当前文件内锚点 |
| `![[图片.png]]` | `![图片](/attachments/图片.png)` | 嵌入图片 |
| `[[attachments/图片.png]]` | `![图片](/attachments/图片.png)` | 图片链接 |

### 4.2 使用示例

```markdown
# 我的文章

这是一个链接到 [[软件安装指南]] 的示例。

你可以使用 [[软件安装指南|安装指南]] 来自定义显示文本。

查看 [[软件安装指南#网络配置]] 的特定章节。

![封面图](attachments/cover.png) 或使用 ![[cover.png]]
```

---

## 五、标签系统

### 5.1 标签格式

支持以下格式：

```markdown
# 英文标签
#obsidian #blog #markdown

# 中文标签
#笔记 #教程 #分享

# 带分隔符的标签
#vue-js #前端开发 #type_script
```

### 5.2 标签位置

1. **Frontmatter 中定义**（推荐）:
```yaml
---
tags: [obsidian, blog, markdown]
---
```

2. **正文中使用**:
```markdown
这是一个关于 #obsidian 的笔记。
```

3. **自动合并**: 正文中的 `#tag` 会自动合并到 frontmatter 的 `tags` 字段

### 5.3 标签规范

- 使用小写字母
- 使用连字符 `-` 或下划线 `_` 分隔单词
- 避免使用特殊字符
- 保持标签的一致性

---

## 六、图片管理

### 6.1 图片存放

```
附件/
├── AI提效/
│   ├── software-setup.png
│   └── tool-recommendation.jpg
└── 编程笔记/
    └── code-example.png
```

### 6.2 图片引用

```markdown
# 方式一：标准 Markdown 语法
![描述](attachments/AI提效/software-setup.png)

# 方式二：Obsidian 语法（自动转换）
![[software-setup.png]]

# 方式三：Wikilinks
[[attachments/AI提效/software-setup.png]]
```

---

## 七、同步与发布

### 7.1 工作流程

```
1. 在 Obsidian 中编辑笔记
   ↓
2. Git 提交（文章和博客代码一起管理）
   git add . && git commit -m "update article"
   ↓
3. 构建博客（自动同步笔记）
   pnpm docs:build
   ↓
4. 部署
   # 自动部署或手动推送
```

### 7.2 同步命令

```bash
# 手动同步（构建时自动执行）
pnpm sync:obsidian

# 构建（会先同步）
pnpm docs:build
```

### 7.3 添加新文章分类

编辑 `scripts/sync-obsidian.js`：

```javascript
syncMappings: [
  { src: '笔记', dest: '01.AI提效' },
  // 添加新分类
  { src: '编程笔记', dest: '02.编程笔记' },
  { src: '读书笔记', dest: '03.读书笔记' },
],
```

### 7.4 草稿管理

```yaml
---
publish: false    # 设置为 false 不发布
---
```

---

## 八、插件配置

### 8.1 teekConfig.ts 配置

```typescript
import { defineTeekConfig } from "@teek/config";

export default defineTeekConfig({
  vitePlugins: {
    // Obsidian Wikilinks 插件
    obsidianWikilink: true,
    obsidianWikilinkOption: {
      resolveMode: 'filePath',
      imageDir: '/attachments',
      onNotFound: 'keep'
    },

    // Obsidian 标签插件
    obsidianTags: true,
    obsidianTagsOption: {
      extractInlineTags: true,
      mergeToFrontmatter: true,
      convertToLinks: false,
      tagsPagePath: '/tags'
    },

    // 自动 frontmatter 插件
    autoFrontmatter: true,
    autoFrontmatterOption: {
      permalinkPrefix: "",
      categories: true,
    }
  }
});
```

---

## 九、最佳实践

### 9.1 写作建议

1. **标题即文件名**: 使用有意义的文件名，如 `软件安装指南.md`
2. **分类清晰**: 合理使用目录层级组织文章
3. **标签适度**: 每篇文章 3-5 个标签为宜
4. **链接完整**: 使用 Wikilinks 时确保目标文件存在

### 9.2 避免的问题

- ❌ 文件名包含特殊字符（如 `?`, `*`, `|`, `<`, `>`）
- ❌ 过深的目录层级（建议不超过 3 层）
- ❌ 重复的标签（大小写不一致，如 `Vue` 和 `vue`）
- ❌ 未提交的草稿直接发布

---

## 十、附录

### 10.1 常用 Frontmatter 模板

**技术文章模板**:
```yaml
---
title:
tags: [技术, ]
categories:
  - 编程笔记
  - 前端
description:
publish: true
---

# {{title}}

## 概述

## 正文

## 总结
```

**工具推荐模板**:
```yaml
---
title:
tags: [工具, 推荐]
categories:
  - AI提效
coverImg:
description:
---

# {{title}}

## 工具简介

## 主要功能

## 使用方法

## 总结
```
