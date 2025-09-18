---
title: Segmented 分段控制器
date: 2025-04-30 08:52:05
permalink: /ecosystem/components/segmented
categories:
  - 生态
  - 主题组件
tags:
  - 生态
  - 主题组件
---

## 基础用法

::: demo
segmented/basic
:::

## 图标使用

::: demo
segmented/icon
:::

## API

### 配置项

| 名称     | 说明         | 类型                                       | 默认值 |
| -------- | ------------ | ------------------------------------------ | ------ |
| v-model  | 选中项绑定值 | `string` / `number` / `object` / `boolean` | —      |
| options  | 选项的数据   | `SegmentedOption[]`                        | []     |
| disabled | 是否禁用     | `boolean`                                  | false  |

### SegmentedOption 配置项

| 名称  | 说明                        | 类型                                            | 默认值 |
| ----- | --------------------------- | ----------------------------------------------- | ------ |
| value | 选择的值                    | `string` / `Object` / `Comment` / `IconifyIcon` | —      |
| label | 展示名称                    | `string`                                        | —      |
| icon  | 展示图标，和 `label` 二选一 | `string`                                        | —      |
| title | 鼠标悬停的 Tip              | `string`                                        | —      |
| name  | input 标签的 name           | `string`                                        | —      |
