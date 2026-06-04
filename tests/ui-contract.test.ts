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

  it('uses an opaque, elevated mobile menu panel', () => {
    const css = read('src/styles/global.css');
    expect(css).toContain('background: rgb(8, 11, 16);');
    expect(css).toMatch(/\.site-mobile-panel\s*\{[\s\S]*?z-index:\s*70;/);
  });
});
