---
title: Popover 弹出框 <Badge type="tip" text="v1.1.0" />
date: 2025-04-22 21:23:28
permalink: /ecosystem/components/popover
categories:
  - 生态
  - 公共组件
tags:
  - 生态
  - 公共组件
---

## 展示位置

Popover 弹出框提供 9 种展示位置。

使用 `content` 属性来设置悬停时显示的信息。 由 `placement` 属性决定 Popover 弹出框的位置。该属性值格式为：[方向]-[对齐位置]，可供选择的四个方向分别是 `top`、`left`、`right`、`bottom`，可供选择的三种对齐方式分别是 `start`、`end`、`null`，默认的对齐方式为 `null`。 以 `placement="left-end"` 为例，Popover 弹出框会显示在悬停元素的左侧，且提示信息的底部与悬停元素的底部对齐。

::: demo
popover/basic
:::

## API

### 属性

| 属性名       | 说明                                                                                                                                        | 类型                                        | 默认值 |
| :----------- | :------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------ | :----- |
| placement    | 出现位置                                                                                                                                    | `click` / `focus` / `hover` / `contextmenu` | bottom |
| trigger      | 触发方式                                                                                                                                    | `click` / `focus` / `hover` / `contextmenu` | hover  |
| content      | 显示的内容，也可以通过写入默认 `slot` 修改显示内容                                                                                          | `string`                                    | ''     |
| width        | 宽度，如果不指定，则会根据内容自动计算                                                                                                      | `string` / `number`                         | —      |
| height       | 高度，如果不指定，则会根据内容自动计算                                                                                                      | `string` / `number`                         | —      |
| disabled     | Popover 是否可用                                                                                                                            | `boolean`                                   | false  |
| v-model      | Popover 是否显示                                                                                                                            | `boolean`                                   | false  |
| offset       | 浮层偏移量，等于 `x-offset` 和 `y-offset`                                                                                                   | `number`                                    | 0      |
| x-offset     | 水平方向浮层偏移量                                                                                                                          | `number`                                    | 0      |
| y-offset     | 垂直方向浮层偏移量                                                                                                                          | `number`                                    | 0      |
| transition   | 定义渐变动画，默认是 el-fade-in-linear                                                                                                      | `string`                                    | —      |
| show-arrow   | 是否显示 Tooltip 箭头， 欲了解更多信息，请参考 [ElPopper](https://github.com/element-plus/element-plus/tree/dev/packages/components/popper) | `boolean`                                   | true   |
| popper-class | 为 popper 添加类名                                                                                                                          | `string`                                    | —      |
| popper-style | 为 popper 自定义样式                                                                                                                        | `string` / `object`                         | —      |
| trigger-el   | 代表 `reference` 插槽的参照元素                                                                                                             | `HTMLElement`                               | —      |
| beforePopup  | 弹框弹出前的回调，支持返回新的 `top`、`right`、`bottom`、`left`                                                                             | `PopoverTransformOptions`                   | —      |

```typescript
interface PopoverTransformOptions {
  /**
   * 弹框的 top 位置
   */
  top: NumStr;
  /**
   * 弹框的 right 位置
   */
  right: NumStr;
  /**
   * 弹框的 bottom 位置
   */
  bottom: NumStr;
  /**
   * 弹框的 left 位置
   */
  left: NumStr;
  /**
   * 触发弹框的 DOM 元素，如果传入 virtualEl 则是 virtualEl 元素
   */
  triggerElement: HTMLDivElement;
  /**
   * 弹框的 DOM 元素
   */
  popoverElement: HTMLDivElement;
}
```

### 插槽

| 插槽名    | 说明                          |
| :-------- | :---------------------------- |
| default   | Popover 内嵌 HTML 文本        |
| reference | 触发 Popover 显示的 HTML 元素 |

事件

| 事件  | 说明                    |
| ----- | ----------------------- |
| focus | 显示时触发              |
| blur  | 隐藏时触发              |
| close | `Escape` 按键触发时触发 |
