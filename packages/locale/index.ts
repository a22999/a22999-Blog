export type LocalesItem = {
  [key: string]: string | string[] | LocalesItem;
};

export type Language = {
  lang: string;
  tk: LocalesItem;
};

export { default as zhCn } from "./lang/zh-cn";
export { default as en } from "./lang/en";
export { default as zhTw } from "./lang/zh-tw";
export { default as ja } from "./lang/ja";
export { default as ko } from "./lang/ko";
