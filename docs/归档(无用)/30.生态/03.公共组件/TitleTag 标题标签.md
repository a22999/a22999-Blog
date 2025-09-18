---
title: TitleTag 标题标签 <Badge type="tip" text="v1.1.5" />
date: 2025-05-10 01:10:39
permalink: /ecosystem/components/title-tag
categories:
  - 生态
  - 公共组件
tags:
  - 生态
  - 公共组件
---

这是一个可以放在标题旁边的一个内联组件。

## 基础用法

::: demo
titleTag/basic
:::

## API

### 属性

| 属性名   | 说明 | 类型                                   | 默认值  |
| :------- | :--- | :------------------------------------- | :------ |
| text     | 文本 | `string`                               | —       |
| type     | 类型 | `Type`                                 | —       |
| position | 位置 | `left` / `right`                       | ''      |
| size     | 大小 | `large` / `default` / `small` / `mini` | default |

Type 类型为：

- `vp-primary`
- `vp-info`
- `vp-success`
- `vp-warning`
- `vp-danger`
- `vp-important`
- `ep-primary`
- `ep-info`
- `ep-success`
- `ep-warning`
- `ep-danger`

`position` 配置项告诉组件位于文本的哪个位置，当为 `left` 时，添加 `margin-right: 4px;` 样式，当为 `right` 时，添加 `margin-left: 4px;` 样式。

### 插槽

| 插槽名  | 说明                         |
| :------ | :--------------------------- |
| default | 文本，覆盖 props 传来的 text |
