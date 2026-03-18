import type { Message } from "@teek/types";

export interface BackTop {
  /**
   * 是否启动回到顶部功能
   *
   * @default true
   */
  enabled?: boolean;
  /**
   * 回到顶部按钮的显示内容
   *
   * @default 'progress'
   */
  content?: "progress" | "icon";
  /**
   * 回到顶部后的回调
   */
  done?: (TkMessage: Message) => void;
}
