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
