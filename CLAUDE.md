# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based blog/note site (Hex Notes) using content collections for blog posts stored as Markdown/MDX files. The site features an ambient grid animation system and a distinctive visual design.

## Development Commands

```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Build production site to ./dist/
npm run preview # Preview production build locally
npm run astro   # Run Astro CLI (e.g., astro add, astro check)
```

## Architecture

### Content Collections

Blog posts are defined in `src/content.config.ts` using Astro's content collections API with a glob loader. Frontmatter schema (`src/content.config.ts:9-21`):
- `title`, `description`, `pubDate`, `category`, `tags[]`, `accent`, `featured`, `heroImage`

Posts live in `src/content/blog/` as `.md` or `.mdx` files. The post `id` (file name without extension) is used for URL slugs.

### Content Utilities

`src/lib/content.ts` provides shared helpers:
- `sortPosts()` - sort by pubDate descending
- `slugify()` - convert Chinese category names to URL slugs (includes hardcoded mappings like `技术 → tech`)
- `formatDate()` - format dates in `zh-CN` locale
- `countBy()` - aggregate posts by category/tag
- `postsByMonth()` - group posts by year-month

### Routing

- `/blog/[...slug]` - individual blog posts (slug = post id)
- `/categories/[category]` - posts filtered by category
- `/tags/[tag]` - posts filtered by tag
- `/archive` - chronological archive
- `/rss.xml.js` - RSS feed

### Layouts

- `BaseLayout.astro` - root layout with ambient grid animation, header/footer
- `BlogPost.astro` - blog post layout with reading surface styling

## Key Files

- `astro.config.mjs` - Astro config with MDX, sitemap integrations, Shiki theme (github-dark), local font setup
- `src/consts.ts` - SITE_TITLE, SITE_DESCRIPTION, SITE_AUTHOR constants
- `src/styles/global.css` - global styles
- `src/components/` - UI components (ArticleCard, Header, Footer, etc.)

## Build Output

Static site outputs to `./dist/`. The `dist/` directory is tracked in `.gitignore`.