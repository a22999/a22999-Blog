---
title: InputSlide 滑块
date: 2025-04-30 09:51:01
permalink: /ecosystem/components/input-slide
categories:
  - 生态
  - 主题组件
tags:
  - 生态
  - 主题组件
---

## 基础用法

::: demo
inputSlide/basic
:::

## API

### 配置项

| 名称     | 说明              | 类型                      | 默认值 |
| -------- | ----------------- | ------------------------- | ------ |
| v-model  | 绑定值            | `number`                  | 0      |
| min      | 最小值            | `number`                  | 0      |
| max      | 最大值            | `number`                  | 100    |
| step     | 步长              | `number`                  | 1      |
| disabled | 是否禁用          | `boolean`                 | false  |
| format   | 格式化显示的内容  | `(val: number) => string` | —      |
| name     | input 标签的 name | `string`                  | Slider |
