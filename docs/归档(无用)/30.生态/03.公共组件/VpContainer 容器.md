---
title: VpContainer 容器
date: 2025-04-13 15:51:52
permalink: /ecosystem/components/vp-container
categories:
  - 生态
  - 公共组件
tags:
  - 生态
  - 公共组件
---

这是一个基于 VitePress 容器进行封装的组件，效果和 VitePress 容器一致。

## 基础用法

::: demo
vpContainer/basic
:::

## API

### 属性

| 属性名 | 说明 | 类型                                  | 默认值 |
| :----- | :--- | :------------------------------------ | :----- |
| type   | 类型 | `info` / `tip` / `warning` / `danger` | tip    |
| title  | 标题 | `string`                              | —      |
| text   | 文本 | `string`                              | —      |

### 插槽

| 插槽名  | 说明                         |
| :------ | :--------------------------- |
| default | 文本，覆盖 props 传来的 text |
