# 🔷 Hex Notes

> 来自 AI 的知识分享，取之于人，用之于人。

一个基于 **Astro** 构建的现代化博客/笔记站点，采用极简设计理念，辅以动感的氛围网格动画系统。

[![Node.js](https://img.shields.io/badge/Node.js->=22.12.0-green?logo=node.js)](https://nodejs.org/)
[![Astro](https://img.shields.io/badge/Astro-6.3.7-purple?logo=astro)](https://astro.build/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ 特性

- 🎨 **极简设计** - 清爽的视觉体验，专注内容阅读
- ✨ **氛围动画** - 环境网格动画系统营造沉浸式体验
- 📝 **Markdown/MDX 支持** - 灵活的内容创作，支持 Rich Components
- 🏷️ **智能分类** - 按分类、标签、时间多维度浏览文章
- 📱 **完全响应式** - 桌面端、平板、手机完美适配
- 🔍 **SEO 优化** - 自动生成 Sitemap 和 RSS Feed
- 🚀 **极速性能** - 静态站点生成，零 JS 框架开销

## 🚀 快速开始

### 前置要求

- Node.js >= 22.12.0
- npm 或其他包管理器

### 安装与开发

```bash
# 克隆项目
git clone https://github.com/theo-lee1/hexnotes.git
cd hexnotes

# 安装依赖
npm install

# 启动开发服务器 (localhost:4321)
npm run dev

# 构建生产版本
npm run build

# 本地预览生产版本
npm run preview
```

## 📁 项目结构

```
hexnotes/
├── src/
│   ├── components/        # Astro 组件
│   │   ├── BaseLayout.astro
│   │   ├── BlogPost.astro
│   │   ├── ArticleCard.astro
│   │   ├── Header.astro
│   │   └── Footer.astro
│   ├── content.config.ts  # 内容集合配置
│   ├── layouts/           # 页面布局
│   ├── pages/             # 路由页面
│   │   ├── index.astro
│   │   ├── blog/[...slug].astro
│   │   ├── categories/[category].astro
│   │   ├── tags/[tag].astro
│   │   ├── archive.astro
│   │   └── rss.xml.js
│   ├── lib/
│   │   └── content.ts     # 内容工具函数
│   ├── styles/
│   │   └── global.css
│   └── consts.ts          # 全局常量
├── astro.config.mjs       # Astro 配置
├── package.json
└── tsconfig.json
```

## 📝 内容管理

Hex Notes 使用“代码仓库 + 内容仓库”的分离模式：

- 代码仓库：`theo-lee1/hexnotes`，存放 Astro 主题、组件、样式、构建配置。
- 内容仓库：`theo-lee1/hexnotes-content`，存放文章、独立页面、图片，以及由内容变化产生的状态文件，例如 `category-colors.json`。

本地开发时，项目优先读取根目录 `content/`；如果没有这个目录，则回退读取 `src/content/` 中的本地测试内容。GitHub Pages 构建时会自动 checkout `theo-lee1/hexnotes-content` 到 `content/`，并用它生成正式网站。

### 为什么采用分库设计

代码仓库只负责“网站怎么运行”：主题样式、页面组件、构建流程、分类颜色分配算法等都在这里维护。内容仓库负责“网站展示什么”：文章、图片、关于页，以及分类到颜色的实际映射关系。

这样设计的主要原因是降低文章和代码互相覆盖的风险。以后修改主题代码时，不需要同步大量文章；发布文章时，也不需要改动代码仓库。`category-colors.json` 放在内容仓库，是因为它记录的是“当前内容里哪些分类使用了哪些颜色”，属于内容状态，而不是主题代码。GitHub Actions 构建时会读取内容仓库里的这个文件；如果文件不存在或分类发生变化，会自动生成/更新并提交回内容仓库。

### 内容仓库结构

```text
hexnotes-content/
├── blog/                 # 博客文章 Markdown/MDX
│   └── my-post.md
├── pages/                # 独立页面内容
│   └── about.md
└── images/               # 文章图片
    └── 2026/example.png
```

### 创建新文章

在内容仓库的 `content/blog/` 目录下创建 `.md` 或 `.mdx` 文件：

```markdown
---
title: "文章标题"
description: "文章描述"
pubDate: 2026-05-26
category: "技术"
tags: ["Astro", "Web开发"]
accent: "#ff6b6b"
featured: true
heroImage: /images/2026/hero.png
---

# 文章内容

你的内容写在这里...

![正文图片](/images/2026/example.png)
```

说明：

- 正文图片和封面图都放在内容仓库的 `content/images/`，文章里用 `/images/...` 引用。
- 构建时 `content/images/` 会同步到代码仓库的 `public/images/` 输出目录。
- `heroImage` 使用站点公共路径，例如 `/images/2026/hero.png`。
- 如果只想在正文中插图，不需要写 `heroImage`。

### 前置信息字段说明

| 字段 | 类型 | 说明 | 必需 |
|------|------|------|------|
| `title` | string | 文章标题 | ✅ |
| `description` | string | 文章描述 | ✅ |
| `pubDate` | date | 发布日期 (YYYY-MM-DD) | ✅ |
| `category` | string | 文章分类 | ✅ |
| `tags` | string[] | 文章标签 | ✅ |
| `accent` | string | 主题色 (十六进制) | ❌ |
| `featured` | boolean | 是否为精选文章 | ❌ |
| `heroImage` | string | 文章头图公共路径，例如 `/images/2026/hero.png` | ❌ |

### 本地关联内容仓库

如果你要在本地预览真实文章，可以把内容仓库克隆到项目根目录的 `content/`：

```bash
git clone https://github.com/theo-lee1/hexnotes-content.git content
npm run dev
```

`content/` 已加入 `.gitignore`，不会被代码仓库提交。这样以后代码修改和文章修改互不覆盖。

### 发布文章

发布文章的流程是修改内容仓库：

```bash
cd content
git add blog images pages
git commit -m "post: add new article"
git push
```

然后回到代码仓库，手动触发 GitHub Pages workflow，或者在代码仓库有新提交时自动构建。正式构建会组合“最新代码 + 最新内容”。

如果希望内容仓库一 push 就自动部署，需要在 `hexnotes-content` 仓库添加 workflow，向代码仓库发送 `content-updated` 事件：

```yaml
name: Notify Hex Notes

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger site rebuild
        run: |
          curl -L \
            -X POST \
            -H "Accept: application/vnd.github+json" \
            -H "Authorization: Bearer ${{ secrets.HEXNOTES_DEPLOY_TOKEN }}" \
            -H "X-GitHub-Api-Version: 2022-11-28" \
            https://api.github.com/repos/theo-lee1/hexnotes/dispatches \
            -d '{"event_type":"content-updated"}'
```

`HEXNOTES_DEPLOY_TOKEN` 需要放在内容仓库的 `Settings -> Secrets and variables -> Actions` 中。使用 fine-grained token 时，目标仓库选择 `theo-lee1/hexnotes`，权限给 `Contents: Read and write` 即可触发 `repository_dispatch`。

## 🛣️ 路由

| 路由 | 说明 |
|------|------|
| `/` | 首页 - 最新文章列表 |
| `/blog/[slug]` | 单篇文章页 |
| `/categories/[category]` | 分类页 - 特定分类的文章 |
| `/tags/[tag]` | 标签页 - 特定标签的文章 |
| `/archive` | 归档页 - 按时间线索浏览 |
| `/rss.xml` | RSS 订阅源 |

## 🛠️ 常用工具函数

`src/lib/content.ts` 提供以下助手函数：

```typescript
// 按发布日期降序排列
sortPosts(posts)

// 转换分类名为 URL slug (例: "技术" → "tech")
slugify(category)

// 格式化日期 (zh-CN 本地化)
formatDate(date)

// 按分类/标签统计文章
countBy(posts, key)

// 按年月分组文章
postsByMonth(posts)
```

## ⚙️ 配置

### 全局常量 (`src/consts.ts`)

```typescript
export const SITE_TITLE = 'Hex Notes';
export const SITE_TAGLINE = '来自 AI 的知识分享，取之于人，用之于人。';
export const SITE_AUTHOR = 'Hex Notes';
```

### 主要集成

- **MDX**: 在 Markdown 中使用 React 组件
- **Sitemap**: 自动生成网站地图
- **RSS**: 博客订阅源
- **Shiki**: 代码高亮 (github-dark 主题)
- **Pinyin**: 中文拼音支持

## 🎨 设计系统

### 全局样式
- `src/styles/global.css` - 全局样式表
- 支持 CSS 变量主题定制
- 响应式网格系统

### 主要组件
- **BaseLayout** - 根布局，包含环境网格动画
- **BlogPost** - 博客文章专用布局，优化阅读体验
- **ArticleCard** - 文章卡片组件
- **Header/Footer** - 页头/页脚导航

## 🔧 脚本命令

```bash
npm run dev      # 启动开发服务器 (热重载)
npm run build    # 构建生产版本到 ./dist/
npm run preview  # 本地预览生产构建
npm run astro    # 运行 Astro CLI 命令
npm run test     # 运行测试套件 (Vitest)
```

## 📦 依赖项

### 核心依赖
- **Astro 6.3.7** - 现代化静态站点生成器
- **@astrojs/mdx** - MDX 支持
- **@astrojs/rss** - RSS 源生成
- **@astrojs/sitemap** - Sitemap 生成
- **remark-gfm** - GitHub 风格 Markdown
- **Sharp** - 图片处理

### 开发工具
- **Vitest** - 单元测试框架
- **Playwright** - E2E 测试浏览器

## 📖 文档参考

- [Astro 文档](https://docs.astro.build/)
- [内容集合 API](https://docs.astro.build/en/guides/content-collections/)
- [MDX 集成](https://docs.astro.build/en/guides/integrations-guide/mdx/)

## 📧 联系方式

- **Email**: [971864679@qq.com](mailto:971864679@qq.com)
- **GitHub**: [@theo-lee1](https://github.com/theo-lee1)
- **Gitee**: [@theo-lee](https://gitee.com/theo-lee)
- **QQ**: 971864679

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

---

<div align="center">

**[⬆ 返回顶部](#-hex-notes)**

Made with ❤️ by [Hex Notes](https://github.com/theo-lee1/hexnotes)

</div>
