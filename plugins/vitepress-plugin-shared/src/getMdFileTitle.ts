/**
 * 获取 Markdown 文件的实际标题
 *
 * 从文件名中提取标题，支持以下格式：
 * - 简单格式: `filename.md` -> `filename`
 * - 带序号格式: `01.title.md` -> `title`
 * - 多级格式: `01.chapter.section.md` -> `chapter.section`
 *
 * @param filename 文件名（包含 .md 后缀）
 * @returns 提取的标题，如果无法提取则返回空字符串
 *
 * @example
 * ```ts
 * import { getMdFileTitle } from "vitepress-plugin-shared";
 *
 * getMdFileTitle("index.md"); // "index"
 * getMdFileTitle("01.intro.md"); // "intro"
 * getMdFileTitle("01.guide.getting-started.md"); // "guide.getting-started"
 * ```
 */
export const getMdFileTitle = (filename: string): string => {
  let title = "";
  // 如果文件名带序号，如【1.xx.md】，则取 xx
  const fileNameArr = filename.split(".");

  if (fileNameArr.length === 2) {
    title = fileNameArr[0];
  } else {
    // 处理多个 . 如 01.guile.md 的情况
    const firstDotIndex = filename.indexOf(".");
    const lastDotIndex = filename.lastIndexOf(".");
    title = filename.substring(firstDotIndex + 1, lastDotIndex);
  }

  return title;
};
