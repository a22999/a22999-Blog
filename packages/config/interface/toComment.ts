import type { Message } from "@teek/types";

export interface ToComment {
  /**
   * 是否启动滚动到评论区功能
   *
   * @default true
   */
  enabled?: boolean;
  /**
   * 滚动到评论区后的回调
   */
  done?: (TkMessage: Message) => void;
}
