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
│   ├── content/
│   │   ├── config.ts      # 内容集合配置
│   │   └── blog/          # 博客文章 (Markdown/MDX)
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

### 创建新文章

在 `src/content/blog/` 目录下创建 `.md` 或 `.mdx` 文件：

```markdown
---
title: "文章标题"
description: "文章描述"
pubDate: 2026-05-26
category: "技术"
tags: ["Astro", "Web开发"]
accent: "#ff6b6b"
featured: true
heroImage: "/images/hero.png"
---

# 文章内容

你的内容写在这里...
```

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
| `heroImage` | string | 文章头图路径 | ❌ |

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
