import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

describe('public page empty states', () => {
  it.each([
    'src/pages/blog/index.astro',
    'src/pages/categories/index.astro',
    'src/pages/tags/index.astro',
    'src/pages/archive/index.astro',
  ])('%s renders the shared empty state when its collection is empty', (path) => {
    const source = read(path);
    expect(source).toContain("import EmptyState from");
    expect(source).toContain('<EmptyState');
  });

  it('homepage reports empty post and tag collections instead of rendering blank responses', () => {
    const source = read('src/pages/index.astro');
    expect(source).toContain('暂无已发布文章');
    expect(source).toContain('暂无可用标签');
  });
});

describe('navigation and page heading clarity', () => {
  it('does not decorate page headings with a misleading plus sign', () => {
    const css = read('src/styles/global.css');
    expect(css).not.toMatch(/\.page-heading::after,\s*\.reading-header::after\s*\{\s*content:\s*'\+'/);
  });

  it('applies the same hover frame treatment to page and reading headings', () => {
    const css = read('src/styles/global.css');
    const layout = read('src/layouts/BaseLayout.astro');
    const hoverBlock =
      css.match(/:where\(([^{}]*)\)\s*:hover,\s*:where\([^{}]*\)\s*\{\s*border-color:\s*var\(--surface-frame-border-hover\)/s)?.[1] ??
      '';
    const motionHoverBlock =
      css.match(/:where\(([^{}]*)\)\s*\{\s*border-color:\s*var\(--surface-frame-border-hover\)\s*!important;/s)?.[1] ?? '';

    expect(hoverBlock).toContain('.page-heading');
    expect(hoverBlock).toContain('.reading-header');
    expect(motionHoverBlock).toContain('.reading-header.is-motion-hover');
    expect(layout).toContain('.reading-header');
  });

  it('uses an opaque, elevated mobile menu panel', () => {
    const css = read('src/styles/global.css');
    expect(css).toContain('background: rgb(8, 11, 16);');
    expect(css).toMatch(/\.site-mobile-panel\s*\{[\s\S]*?z-index:\s*70;/);
  });
});

describe('footer contact links', () => {
  it('uses visually balanced icon sizes and one consistent click-target size', () => {
    const footer = read('src/components/Footer.astro');
    const css = read('src/styles/global.css');

    expect(css).toMatch(/\.site-footer-contact-link\s*\{[^}]*width:\s*18px;[^}]*height:\s*18px;/s);
    expect(css).toMatch(/\.site-footer-contact-link\s+svg\s*\{[^}]*flex:\s*0 0 auto;/s);
    expect(css).toMatch(/\.site-footer-contact-link\[aria-label="邮箱"\]\s+svg\s*\{[^}]*width:\s*20px;[^}]*height:\s*20px;/s);
    expect(css).toMatch(/\.site-footer-contact-link\[aria-label="QQ"\]\s+svg\s*\{[^}]*width:\s*15px;[^}]*height:\s*15px;/s);
    expect(css).toMatch(/\.site-footer-contact-link\[aria-label="GitHub"\]\s+svg\s*\{[^}]*width:\s*19px;[^}]*height:\s*19px;/s);
    expect(css).toMatch(/\.site-footer-contact-link\[aria-label="Gitee"\]\s+svg\s*\{[^}]*width:\s*15px;[^}]*height:\s*15px;/s);
  });
});

describe('homepage terminal mark', () => {
  it('pins the ASCII mark to a bundled mono font and tunes its proportions', () => {
    const source = read('src/pages/index.astro');
    const head = read('src/components/BaseHead.astro');
    const css = read('src/styles/global.css');

    expect(head).toContain("@fontsource/cascadia-mono/latin-400.css");
    expect(head).toContain("@fontsource/cascadia-mono/symbols2-400.css");
    expect(css).toContain('--font-ascii: "Cascadia Mono", monospace;');
    expect(source).toMatch(/\.terminal-ascii\s*\{[\s\S]*?font-family:\s*var\(--font-ascii\), monospace;/);
    expect(source).toContain('font-variant-ligatures: none;');
    expect(source).toContain('letter-spacing: 0.01em;');
    expect(source).toContain('transform: scaleX(0.90) scaleY(1.14);');
    expect(source).toContain('<pre class="terminal-ascii mobile-only">{mobileAscii}</pre>');
  });
});

describe('site typography', () => {
  it('pins prose to the bundled Songti-style font and technical UI to the bundled mono font', () => {
    const head = read('src/components/BaseHead.astro');
    const css = read('src/styles/global.css');

    expect(head).toContain("@fontsource/noto-serif-sc/400.css");
    expect(head).toContain("@fontsource/noto-serif-sc/500.css");
    expect(head).toContain("@fontsource/noto-serif-sc/600.css");
    expect(head).toContain("@fontsource/noto-serif-sc/700.css");
    expect(css).toContain('--font-display: "Noto Serif SC", serif;');
    expect(css).toContain('--font-body: "Noto Serif SC", serif;');
    expect(css).toContain('--font-geist-mono: "Cascadia Mono", monospace;');
    expect(css).toContain('--font-code: "Cascadia Mono", monospace;');
    expect(css).toMatch(/\.markdown-content pre code\s*\{[^}]*font-family:\s*var\(--font-code\), monospace;/s);
    expect(css).not.toContain('Songti SC');
    expect(css).not.toContain('SFMono-Regular');
  });
});

describe('homepage mobile latest posts', () => {
  it('keeps latest posts to category, title, and month-day date on one mobile row', () => {
    const source = read('src/pages/index.astro');

    expect(source).toContain('const formatMonthDay');
    expect(source).toContain('terminal-date terminal-date--full');
    expect(source).toContain('terminal-date terminal-date--short');
    expect(source).toMatch(/\.terminal-post\s*\{[\s\S]*?grid-template-columns:\s*auto minmax\(0, 1fr\) auto;/);
    expect(source).toMatch(/\.terminal-post \.terminal-index\s*\{[\s\S]*?display:\s*none;/);
    expect(source).toMatch(/\.terminal-date--full\s*\{[\s\S]*?display:\s*none;/);
  });
});

describe('article title layout', () => {
  it('lets article card titles use the full content width before wrapping', () => {
    const css = read('src/styles/global.css');

    expect(css).toMatch(/\.note-card\.article-card-concept-index-slab \.article-card-concept-body\s*\{[^}]*width:\s*100%;/s);
    expect(css).toMatch(/\.note-card\.article-card-concept-index-slab \.article-card-concept-body h3\s*\{[^}]*width:\s*100%;/s);
    expect(css).toMatch(/\.note-card\.article-card-concept-index-slab \.note-card-title\s*\{[^}]*text-wrap:\s*normal;/s);
    expect(css).toMatch(/\.note-card\.article-card-concept-index-slab \.article-card-concept-body > p:not\(\.note-card-meta\)\s*\{[^}]*width:\s*100%;/s);
    expect(css).toMatch(/\.note-card\.article-card-concept-index-slab \.article-card-concept-body > p:not\(\.note-card-meta\)\s*\{[^}]*text-wrap:\s*normal;/s);
  });

  it('auto-fits reading page titles before allowing them to wrap', () => {
    const layout = read('src/layouts/BlogPost.astro');
    const css = read('src/styles/global.css');

    expect(layout).toContain('data-auto-title');
    expect(layout).toContain('fitReadingTitle');
    expect(css).toContain('--reading-title-fit-size');
    expect(css).toMatch(/\.reading-header h1\[data-auto-title\]\.is-wrapped\s*\{[^}]*white-space:\s*normal;/s);
  });
});
