# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace Structure

This is a pnpm workspace with three projects:

```
web-projects/
├── blog-libs/      # Shared component/fetch/hook library
├── next-app/       # Next.js 16 app (Turbopack by default)
└── reactblog/      # Rspack-based React app
```

## Commands

### Root level
```bash
pnpm install              # Install all workspace dependencies
pnpm -r build            # Build all packages
pnpm -r --parallel dev    # Dev all packages in parallel
```

### blog-libs
```bash
pnpm --filter @xiaxiazheng/blog-libs build   # Build the library
pnpm --filter @xiaxiazheng/blog-libs watch    # Watch mode for development
```

### next-app (Next.js 16 with Turbopack)
```bash
pnpm --filter next-app dev     # Development server at localhost:3000/m
pnpm --filter next-app build   # Production build
pnpm --filter next-app lint    # ESLint
```

### reactblog (Rspack)
```bash
pnpm --filter reactblog dev          # Dev server
pnpm --filter reactblog build        # Production build
pnpm --filter reactblog devLocal     # Dev with localhost config
pnpm --filter reactblog buildLocal   # Build with localhost config
```

## Architecture

### blog-libs
Shared library built with rslib. Exports:
- **Components**: todo-item, todo-tree, todo-form, markdown-show, img-show-modal, loading, etc.
- **Hooks**: `useSettingsContext`, `useSettings`
- **Fetch modules**: todo, blog, home, media, note, settings, etc.
- **Utils**: types, todo utilities, concurrent helpers

Exports via `src/index.tsx`. Build output goes to `dist/`.

### next-app
Next.js 16 app at path `/m` (basePath). Uses:
- React Compiler (babel-plugin-react-compiler)
- Turbopack for dev (webpack config is NOT compatible)
- CSS Modules + global SCSS
- `transpilePackages: ['@xiaxiazheng/blog-libs']` to process blog-libs

### reactblog
Rspack-based React app. Uses:
- React Router v5
- Redux/Rematch for state
- Ant Design v6

## Workspace Dependencies

Both `next-app` and `reactblog` use `workspace:*` protocol to reference blog-libs:
```json
"@xiaxiazheng/blog-libs": "workspace:*"
```

pnpm symlinks this to `node_modules/@xiaxiazheng/blog-libs -> blog-libs`.

## Important Notes

- **SCSS imports**: Turbopack's sass处理不能通过 symlink 解析 `@xiaxiazheng/blog-libs` 路径。SCSS 文件中使用 `@import` 时需要特别注意路径解析问题，或考虑将共享样式文件放在本地。
- **blog-libs dist**: rslib builds to `dist/` with `bundle: false`, so imports resolve to `blog-libs/dist/index.js`
- **Turbopack**: Next.js 16 uses Turbopack by default. Do NOT add `webpack` config to next.config.ts - use `turbopack` config instead if needed.
- **darkTheme**: Shared CSS styles for dark mode. Currently placed at `blog-libs/src/styles/darkTheme.css` and imported in next-app and reactblog.
