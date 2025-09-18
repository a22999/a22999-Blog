---
title: PageCard 分页卡片
date: 2025-04-13 15:50:43
permalink: /ecosystem/components/page-card
categories:
  - 生态
  - 公共组件
tags:
  - 生态
  - 公共组件
---

PageCard 组件是一个快速构建卡片的组件，因内置分页功能从而取名 PageCard。Teek 使用该组件构建了首页的右侧卡片区域。

## 基础用法

::: demo
pageCard/basic
:::

## 标题点击

传入 `titleLink` 或 `titleClick` 来支持标题的点击。

::: demo
pageCard/title
:::

## 分页功能

传入 `page` 来实现分页功能，如果想自动翻页，则传入 `autoPage` 为 true。

::: demo
pageCard/pagination
:::

## API

### 配置项

| 事件名     | 说明                                                                         | 类型         | 默认值 |
| :--------- | :--------------------------------------------------------------------------- | :----------- | :----- |
| title      | 标题                                                                         | `string`     | —      |
| titleLink  | 标题链接，如果是 http/https 等协议带头，则打开新窗口跳转，否则在当前窗口跳转 | `string`     | —      |
| titleClick | 标题点击事件，优先级低于 titleLink                                           | `() => void` | —      |
| page       | 是否开启分页功能                                                             | `boolean`    | false  |
| pageSize   | 每页显示数量                                                                 | `number`     | 4      |
| total      | 数量                                                                         | `number`     | 0      |
| autoPage   | 是否开启自动分页                                                             | `boolean`    | false  |
| pageSpeed  | 翻页间隔事件，单位毫秒，仅当 autoPage 为 true 生效                           | `number`     | 400    |

### 插槽

| 插槽名     | 说明               |
| :--------- | :----------------- |
| default    | 自定义主内容       |
| title      | 自定义标题内容     |
| page       | 自定义分页区内容   |
| page-left  | 自定义分页左侧按钮 |
| page-right | 自定义分页右侧按钮 |
