# Fix Session - 架构与目录优化修复记录

> 开始时间: 2026-03-18
> 状态: ✅ 已完成

---

## 修复任务清单

### 阶段一：紧急修复 (低风险)

| # | 任务 | 文件 | 状态 | 执行者 | 备注 |
|---|------|------|------|--------|------|
| 1.1 | 修复 lint 脚本 yarn → pnpm | `package.json` | ✅ 已完成 | Claude | - |
| 1.2 | 删除归档目录 | `docs/归档(无用)/` | ✅ 已完成 | Claude | - |
| 1.3 | 删除拼写错误的配置文件 | `docs/.vitepress/comfig.mts` | ✅ 已完成 | Claude | - |

### 阶段二：代码重复消除 (中等风险)

| # | 任务 | 涉及文件 | 状态 | 执行者 | 备注 |
|---|------|----------|------|--------|------|
| 2.1 | 创建插件共享工具包 | 新建 `vitepress-plugin-shared` | ✅ 已完成 | Claude | 抽取 log.ts 和 getMdFileTitle.ts |
| 2.2 | 统一 tsconfig 配置继承 | 7 个插件的 tsconfig.json | ✅ 已完成 | Claude | 使用 extends 继承 tsconfig.base.json |
| 2.3 | 统一 build.config.ts | 7 个插件的构建配置 | ✅ 已完成 | Claude | 创建 `build/plugin-build.ts` 共享配置工厂 |

### 阶段三：架构重构 (高风险) - 评估结论

| # | 任务 | 说明 | 状态 | 执行者 | 备注 |
|---|------|------|------|--------|------|
| 3.1 | 拆分 config 包 | 分离类型定义和插件注册 | ⏭️ 跳过 | Claude | 风险大于收益，不建议执行 |
| 3.2 | 解决反向依赖 | config → components 类型依赖 | ✅ 已完成 | Claude | 创建 @teek/types 包，更新 13 个文件 |
| 3.3 | 调整 composables/helper 边界 | 重新组织依赖关系 | ⏭️ 跳过 | Claude | 当前依赖方向合理，无需调整 |

### 阶段四：目录结构优化

| # | 任务 | 变更 | 状态 | 执行者 | 备注 |
|---|------|------|------|--------|------|
| 4.1 | build 移出 workspace | 修改 `pnpm-workspace.yaml` | ⏭️ 跳过 | Claude | build 作为构建工具包，保持现状不影响功能 |
| 4.2 | 移动 docs/.scripts | 移至根目录 `scripts/` | ✅ 已完成 | Claude | - |

---

## 执行日志

### 2026-03-18

- 初始化 fix-session 文档
- 启动 agent team 进行并行修复...
- **任务 1.1**: 修复 `package.json` 第23行 lint 脚本，将 yarn 改为 pnpm ✅
- **任务 1.2**: 删除归档目录 `docs/归档(无用)/` ✅
- **任务 1.3**: 删除拼写错误的配置文件 `docs/.vitepress/comfig.mts` (确认无引用后删除) ✅
- **任务 2.1**: 创建插件共享工具包 `vitepress-plugin-shared` ✅
  - 创建 `plugins/vitepress-plugin-shared/` 包结构
  - 抽取 `createPluginLogger()` 工厂函数到 `log.ts`（从 6 个插件抽取）
  - 抽取 `getMdFileTitle()` 函数到 `getMdFileTitle.ts`（从 auto-frontmatter 和 md-h1 插件抽取）
  - 更新 `build/plugin-build.ts` 添加 `vitepress-plugin-shared` 到默认外部依赖
  - 更新所有使用日志工具的插件使用共享包
  - 验证 `pnpm stub` 构建成功
- **任务 2.2**: 统一 7 个插件的 tsconfig.json 配置 ✅
  - 5 个标准插件使用 `extends` 继承 `tsconfig.base.json`
  - 2 个特殊插件 (doc-analysis, file-content-loader) 保留必要的自定义配置
  - 每个插件配置从 19 行减少到 6-14 行
- **任务 2.3**: 统一 7 个插件的 build.config.ts 配置 ✅
  - 创建 `build/plugin-build.ts` 共享配置工厂函数 `createPluginBuildConfig()`
  - 提供 `vitepressExternals` 常量用于 VitePress 相关插件
  - 更新所有 7 个插件引用共享配置
  - 验证 `pnpm stub` 构建成功
- **阶段三评估**: 架构重构风险评估完成
  - 任务 3.1: 拆分 config 包 - 风险高，收益有限，建议跳过
  - 任务 3.3: composables/helper 边界 - 当前依赖方向正确，无需调整
- **任务 3.2**: 解决反向依赖 ✅
  - 创建 `packages/types/` 包，包含 icon.ts, message.ts, avatar.ts, viewer.ts, title-tag.ts, layout.ts, theme.ts
  - 更新 `packages/config/interface/` 下 11 个文件，从 `@teek/components` 改为 `@teek/types`
  - 更新 `packages/config/types.ts` 导入路径
  - 更新 `packages/config/package.json` 添加 `@teek/types` 依赖
  - 更新 `packages/teek/index.ts` 导出 `@teek/types`
  - 更新 `packages/teek/package.json` 添加 `@teek/types` 依赖
  - 修复 `toComment.ts` 和 `backTop.ts` 中 Message 从值导入改为类型导入
  - 验证 `pnpm install`, `pnpm stub`, `pnpm docs:build` 全部成功
- **阶段四评估**: 目录结构优化评估完成
  - 任务 4.1: build 移出 workspace - 保持现状，不影响功能
- **任务 4.2**: 移动 docs/.scripts 到根目录 scripts/ ✅
  - 移动 `docs/.scripts/baiduPush.ts` 到 `scripts/baiduPush.ts`
  - 移动 `docs/.scripts/baiduPush.sh` 到 `scripts/baiduPush.sh`
  - 更新 `docs/package.json` 中 baiduPush 脚本路径引用
  - 删除空的 `docs/.scripts/` 目录
- **阶段五**: Obsidian 文章管理适配 ✅
  - 任务 5.1: 创建 `vitepress-plugin-obsidian-wikilink` 插件
    - 支持 6 种 Wikilinks 语法转换
    - 支持 permalink/filePath/title 三种解析模式
    - 支持图片链接转换
  - 任务 5.2: 创建 `vitepress-plugin-obsidian-tags` 插件
    - 支持正文 `#tag` 标签提取
    - 支持标签合并到 frontmatter
    - 支持标签转换为链接
  - 任务 5.4: 创建 `docs/OBSIDIAN_GUIDE.md` 规范文档
    - 定义目录结构设计
    - 定义 Frontmatter 规范
    - 定义 Wikilinks 语法规范
    - 定义标签系统规范
    - 定义图片管理规范
    - 定义同步与发布流程
  - 任务 5.5: 创建 Obsidian 目录和同步脚本
    - 创建 `obsidian/` 目录（在项目内）
    - 创建 `scripts/sync-obsidian.js` 同步脚本
    - 更新 `package.json` 添加 `sync:obsidian` 和 `docs:build` 脚本
    - `docs:build` 现在会自动同步 Obsidian 笔记
    - 配置目录映射: `obsidian/笔记` -> `docs/01.AI提效`
    - 更新 `.gitignore` 忽略 Obsidian workspace 文件

---

## 验证检查

- [x] `pnpm install` 成功 ✅
- [x] `pnpm stub` 成功 ✅
- [x] `pnpm docs:build` 成功 ✅
- [x] `pnpm lint` 成功 ✅
  - 修复 `file-content-loader/index.ts` 中未使用的 `relative` 导入
  - 修复注释中的特殊字符导致的解析错误

---

## 状态说明

- ⏳ 待开始
- 🔄 进行中
- ✅ 已完成
- ❌ 失败/跳过

---

## 阶段五：Obsidian 文章管理适配

| # | 任务 | 说明 | 状态 | 执行者 | 备注 |
|---|------|------|------|--------|------|
| 5.1 | 创建 obsidian-wikilink 插件 | Wikilinks `[[xxx]]` 转换为标准链接 | ✅ 已完成 | Claude | 支持 6 种 Wikilinks 语法 |
| 5.2 | 创建 obsidian-tags 插件 | 正文标签 `#tag` 提取与转换 | ✅ 已完成 | Claude | 支持标签提取、合并、转换 |
| 5.3 | 增强 auto-frontmatter 插件 | 支持正文标签提取、分类自动生成 | ⏭️ 跳过 | Claude | 已由 obsidian-tags 插件实现 |
| 5.4 | 更新文章目录结构 | 设计 Obsidian 兼容的目录结构 | ✅ 已完成 | Claude | 创建 `docs/OBSIDIAN_GUIDE.md` 规范文档 |
| 5.5 | 配置同步方案 | 构建时自动同步脚本 | ✅ 已完成 | Claude | 创建 `scripts/sync-obsidian.js` |
