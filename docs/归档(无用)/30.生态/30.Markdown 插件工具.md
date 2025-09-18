---
title: Markdown 插件工具
date: 2025-03-30 17:39:41
permalink: /ecosystem/md-plugin-utils
categories:
  - 生态
tags:
  - 生态
---

Teek 提供了 Markdown 插件工具，用于快速开发 Markdown 容器。

## 简单容器

创建简单容器：

::: code-group

```ts [创建简单容器数据并直接使用]
import { createContainerThenUse } from "vitepress-theme-teek";
import MarkdownIt from "markdown-it";

// 创建 markdown it 实例
const md = MarkdownIt({ html: true, linkify: true });

const containerInfo = createContainerThenUse(md, {
  type: "center",
  useTitle: false,
  className: `tk-center-container`,
});
```

```ts [创建简单容器数据并获取]
import { createContainerThenGet } from "vitepress-theme-teek";
import MarkdownIt from "markdown-it";

// 创建 markdown it 实例
const md = MarkdownIt({ html: true, linkify: true });

const containerInfo = createContainersThenUse(md, {
  type: "center",
  useTitle: false,
  className: `tk-center-container`,
});

md.use(containerInfo);
```

:::

一次性创建多个简单容器：

::: code-group

```ts [创建多个简单容器数据并直接使用]
import { createContainersThenUse } from "vitepress-theme-teek";

const markdownContainer = [
  { type: "center", useTitle: false, className: `tk-center-container` },
  { type: "right", useTitle: false, className: `tk-right-container` },
  { type: "note", useTitle: true, defaultTitle: containerLabel?.noteLabel || "NOTE", className: `custom-block` },
];

createContainersThenUse(md, markdownContainer);
```

```ts [创建多个简单容器数据并获取]
import { createContainersThenGet } from "vitepress-theme-teek";

const markdownContainer = [
  { type: "center", useTitle: false, className: `tk-center-container` },
  { type: "right", useTitle: false, className: `tk-right-container` },
  { type: "note", useTitle: true, defaultTitle: containerLabel?.noteLabel || "NOTE", className: `custom-block` },
];

const containerInfo = createContainersThenGet(md, markdownContainer);

md.use(...containerInfo);
```

:::

## 卡片容器

创建卡片容器。

```ts
import { createCardContainer } from "vitepress-theme-teek";
import MarkdownIt from "markdown-it";

interface DemoCardItem {
  /**
   * 名称
   */
  name: string;
  /**
   * 描述
   */
  desc?: string;
}

interface DemoCardConfig {
  /**
   * 卡片数量
   */
  cardNum: number;
}

// 创建 markdown it 实例
const md = MarkdownIt({ html: true, linkify: true });

createCardContainer<DemoCardItem, DemoCardConfig>(md, {
  type: "demoCard",
  className: `demo-card-container`,
  htmlRender: (props, info) => renderImgCard(props, info),
});

const renderDemoCard = (demoCard: { data: DemoCardItem[]; config?: DemoCardConfig }, info: string) => {
  const { data = [], config = {} } = demoCard;
  if (!data.length) return "";

  const { cardNum = 2 } = config;

  return `
    <div class="demo-card index-${cardNum}">
      ${data.map(card => `<p class="title">${info}</p> <p class="name">${card.name}</p>`).join("")}
    </div>
  `;
};
```

一次性创建多个卡片容器：

```ts
import { createCardContainers } from "vitepress-theme-teek";
import MarkdownIt from "markdown-it";

// 创建 markdown it 实例
const md = MarkdownIt({ html: true, linkify: true });

createCardContainers(md, [{}, {}]);
```
