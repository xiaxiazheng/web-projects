# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace Structure

This is a pnpm workspace containing five projects across four separate git repositories:

```
web-projects/                    # pnpm workspace root (1 git repo: web-projects)
├── apps/
│   ├── next-app/               # Next.js 16 app (1 git repo: next-app)
│   ├── reactblog/              # Rspack-based React app (1 git repo: reactblog)
│   └── blog-deploy/            # Static deploy (1 git repo: blog-deploy)
└── packages/
    └── blog-libs/              # Shared component/fetch/hook library (1 git repo: blog-libs)
```

**Important**: Each sub-project (next-app, reactblog, blog-libs, blog-deploy) is its own git repository. Git operations (`git add`, `git commit`, `git push`) must be executed **within each project's directory** or using `git -C <path>`.

## Commands

### Root level (web-projects workspace)
```bash
pnpm install              # Install all workspace dependencies
pnpm -r build            # Build all packages
pnpm -r --parallel dev   # Dev all packages in parallel
```

### packages/blog-libs
```bash
pnpm --filter @xiaxiazheng/blog-libs build   # Build the library
pnpm --filter @xiaxiazheng/blog-libs watch    # Watch mode for development
```

### apps/next-app (Next.js 16 with Turbopack)
```bash
pnpm --filter next-app dev     # Development server at localhost:3000/m
pnpm --filter next-app build   # Production build
pnpm --filter next-app lint    # ESLint
```

### apps/reactblog (Rspack)
```bash
pnpm --filter reactblog dev          # Dev server
pnpm --filter reactblog build        # Production build
pnpm --filter reactblog devLocal     # Dev with localhost config
pnpm --filter reactblog buildLocal   # Build with localhost config
```

### apps/blog-deploy
Static deployment files, no dev commands.

## Architecture

### blog-libs
Shared library built with rslib. Exports:
- **Components**: todo-item, todo-tree, todo-form, markdown-show, img-show-modal, loading, etc.
- **Hooks**: `useSettingsContext`, `useSettings`
- **Fetch modules**: todo, blog, home, media, note, settings, folder, etc.
- **Utils**: types, todo utilities, concurrent helpers, mermaidPlugin

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

### blog-deploy
Static site deployment with HTML/JS/CSS assets.

## Workspace Dependencies

`next-app` and `reactblog` use `workspace:*` protocol to reference blog-libs:
```json
"@xiaxiazheng/blog-libs": "workspace:*"
```

pnpm symlinks this to `node_modules/@xiaxiazheng/blog-libs -> packages/blog-libs`.

## Git Workflow

Since each project is a separate git repository, when making changes:

1. **Commit to each sub-project** (next-app, reactblog, blog-libs, blog-deploy):
   ```bash
   git -C apps/next-app add .
   git -C apps/next-app commit -m "message"
   git -C apps/next-app push
   # repeat for each project
   ```

2. **Commit to web-projects workspace** (pnpm-workspace.yaml, CLAUDE.md changes):
   ```bash
   git add .
   git commit -m "message"
   git push
   ```

## Important Notes

- **SCSS imports**: Turbopack's sass处理不能通过 symlink 解析 `@xiaxiazheng/blog-libs` 路径。SCSS 文件中使用 `@import` 时需要特别注意路径解析问题，或考虑将共享样式文件放在本地。
- **blog-libs dist**: rslib builds to `dist/` with `bundle: false`, so imports resolve to `blog-libs/dist/index.js`
- **Turbopack**: Next.js 16 uses Turbopack by default. Do NOT add `webpack` config to next.config.ts - use `turbopack` config instead if needed.
- **darkTheme**: Shared CSS styles for dark mode. Currently placed at `blog-libs/src/styles/darkTheme.css` and imported in next-app and reactblog.