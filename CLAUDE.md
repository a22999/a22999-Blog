# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

vitepress-theme-teek is a VitePress theme for building blogs, documentation sites, and knowledge bases. It extends VitePress's default theme with additional features like blog layouts, article management, and various UI components.

## Development Commands

```bash
# Install dependencies (pnpm is required - npm/yarn are blocked)
pnpm install

# Development - build packages in stub mode, then start docs server
pnpm stub && pnpm docs:dev

# Start docs development server only
pnpm docs:dev

# Build documentation
pnpm docs:build

# Preview built documentation
pnpm docs:preview

# Build all packages for production
pnpm build

# Linting
pnpm lint              # Run both ESLint and Prettier
pnpm lint:eslint       # Run ESLint only
pnpm lint:prettier     # Run Prettier only
```

## Architecture

### Monorepo Structure

This is a pnpm workspace monorepo with the following main directories:

- **`packages/`** - Core theme packages, each published as `@teek/*`:
  - `teek` - Main theme entry point, exports the VitePress theme
  - `components` - Vue components (TkLayout, TkArchivesPage, etc.)
  - `composables` - Vue composables/hooks
  - `config` - Theme configuration types and `defineTeekConfig`
  - `helper` - Utility functions (analytics, client detection, etc.)
  - `locale` - Internationalization
  - `markdown` - Markdown processing utilities
  - `static` - Static assets (icons, fonts)
  - `theme-chalk` - SCSS styles

- **`plugins/`** - VitePress plugins (prefixed `vitepress-plugin-*`):
  - `auto-frontmatter` - Auto-generate frontmatter
  - `catalogue` - Generate catalogue pages
  - `doc-analysis` - Document analysis (word count, reading time)
  - `file-content-loader` - Load markdown content
  - `md-h1` - Extract H1 from markdown
  - `permalink` - Generate permalinks
  - `sidebar-resolve` - Auto-generate sidebar

- **`docs/`** - VitePress documentation site that uses the local theme
- **`build/`** - Build scripts using unbuild

### Theme Configuration

The theme is configured via `defineTeekConfig()` in `docs/.vitepress/teekConfig.ts`. Key configuration areas:

- `banner` - Homepage banner styling (pure/partImg/fullImg modes)
- `post` - Article list styling (list/card modes)
- `pageStyle` - Article page style (default/card/segment)
- `vitePlugins` - Enable/configure bundled VitePress plugins

### Package Imports

Local packages use the `@teek/*` alias configured in `tsconfig.base.json`:

```typescript
import { TkLayout } from "@teek/components";
import { defineTeekConfig } from "@teek/config";
```

## Code Style

- TypeScript with Vue 3 composition API
- ESLint + Prettier for formatting
- Commit messages follow conventional commits (feat/fix/docs/style/refactor/perf/test/build/ci/revert/chore)

## Notes

- The project enforces pnpm via a preinstall script
- Husky runs lint-staged on pre-commit
- Changesets are used for versioning (`pnpm cs`)
