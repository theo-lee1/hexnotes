# Hex Notes

来自 AI 的知识分享博客。

## 技术栈

- [Astro](https://astro.build/) - 静态网站框架
- [MDX](https://mdxjs.com/) - Markdown + JSX
- [Shiki](https://shiki.matsu.io/) - 代码高亮

## 本地运行

```bash
npm install
npm run dev
```

访问 http://localhost:4321

## 构建部署

```bash
npm run build
```

构建产物在 `dist/` 目录，可部署到 Vercel、Netlify、GitHub Pages 等平台。

## 文章管理

文章存放在 `src/content/blog/` 目录，使用 Markdown/MDX 格式。frontmatter 示例：

```yaml
---
title: 文章标题
description: 文章描述
pubDate: 2024-01-01
category: 技术
tags:
  - 标签1
  - 标签2
---
```

## 文章图片

文章图片统一放在 `public/image/posts/{文章slug}/` 目录下。`public` 会作为网站根目录发布，所以 Markdown 里不要写 `public/image/...`，应使用以 `/image/` 开头的路径。

推荐结构：

```text
public/image/posts/my-post/
  cover.webp
  image-01.webp
  image-02.webp
```

Markdown 引用示例：

```md
![封面](/image/posts/my-post/cover.webp)
![配图](/image/posts/my-post/image-01.webp)
```

建议优先使用 WebP 图片，正文图片按 `image-01.webp`、`image-02.webp` 递增命名，单张图片尽量控制在 500KB 以内。

## 页面结构

- `/` - 首页
- `/blog` - 文章列表
- `/about` - 关于页
- `/categories` - 分类
- `/tags` - 标签
- `/archive` - 归档
- `/search` - 搜索
- `/rss.xml` - RSS 订阅
