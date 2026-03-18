import type { IconProps } from "./icon";

/**
 * Vue VNode 类型（通用定义）
 */
export type VueVNode = {
  __isVNode?: true;
  type?: any;
  props?: Record<string, any> | null;
  children?: any;
  shapeFlag?: number;
  patchFlag?: number;
} & Record<string, any>;

/**
 * Vue AppContext 类型（通用定义）
 */
export type VueAppContext = {
  app?: any;
  config?: Record<string, any>;
  provides?: Record<string, any>;
} & Record<string, any>;

/**
 * Message 类型
 */
export type MessageType = "primary" | "success" | "info" | "warning" | "error";

/**
 * Message 配置上下文
 */
export interface MessageConfigContext {
  max?: number;
  grouping?: boolean;
  duration?: number;
  offset?: number;
  showClose?: boolean;
}

/**
 * Message Props 类型
 */
export interface MessageProps {
  customClass?: string;
  center?: boolean;
  dangerouslyUseHTMLString?: boolean;
  duration?: number;
  icon?: IconProps["icon"];
  id?: string;
  message?: string | VueVNode | (() => VueVNode);
  onClose?: () => void;
  showClose?: boolean;
  type?: MessageType;
  plain?: boolean;
  offset?: number;
  zIndex?: number;
  grouping?: boolean;
  repeatNum?: number;
}

/**
 * Message Emits 类型
 */
export interface MessageEmits {
  destroy: [];
}

/**
 * Message Options 类型
 */
export type MessageOptions = Partial<
  Omit<MessageProps, "id"> & {
    appendTo?: HTMLElement | string;
  }
>;

/**
 * Message Params 类型
 */
export type MessageParams = MessageOptions | MessageOptions["message"];

/**
 * Message Params Normalized 类型
 */
export type MessageParamsNormalized = Omit<MessageProps, "id"> & {
  /**
   * 设置消息的根元素，默认为`document.body`
   */
  appendTo: HTMLElement;
};

/**
 * Message Options With Type 类型
 */
export type MessageOptionsWithType = Omit<MessageOptions, "type">;

/**
 * Message Params With Type 类型
 */
export type MessageParamsWithType = MessageOptionsWithType | MessageOptions["message"];

/**
 * Message Handler 类型
 */
export interface MessageHandler {
  /**
   * 关闭消息
   */
  close: () => void;
}

/**
 * Message Fn 类型
 */
export type MessageFn = {
  (options?: MessageParams, appContext?: null | VueAppContext): MessageHandler;
  closeAll(type?: MessageType): void;
};

/**
 * Message Typed Fn 类型
 */
export type MessageTypedFn = (options?: MessageParamsWithType, appContext?: null | VueAppContext) => MessageHandler;

/**
 * Message 类型
 */
export type Message = MessageFn & {
  [K in MessageType]: MessageTypedFn;
};
