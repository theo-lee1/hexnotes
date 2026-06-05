import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

describe('Busuanzi page-view statistics', () => {
  it('loads the Busuanzi counter without the retired self-hosted API', () => {
    const layout = read('src/layouts/BaseLayout.astro');
    const constants = read('src/consts.ts');
    expect(layout).toContain('busuanzi.pure.mini.js');
    expect(layout).toContain("['www.hexnotes.cc', 'hexnotes.cc']");
    expect(layout).not.toContain('/api/v1/view');
    expect(constants).not.toContain('STATS_API_URL');
  });

  it('shows site totals in the home terminal and a current-page view counter with an eye icon', () => {
    const footer = read('src/components/Footer.astro');
    const home = read('src/pages/index.astro');
    const post = read('src/layouts/BlogPost.astro');
    expect(footer).not.toContain('busuanzi_container_site_pv');
    expect(footer).not.toContain('busuanzi_container_site_uv');
    expect(home).toContain('busuanzi_container_site_pv');
    expect(home).toContain('busuanzi_value_site_pv');
    expect(home).toContain('busuanzi_container_site_uv');
    expect(home).toContain('busuanzi_value_site_uv');
    expect(post).toContain('busuanzi_container_page_pv');
    expect(post).toContain('busuanzi_value_page_pv');
    expect(post).toContain('page-view-eye');
  });

  it('does not show the current list page count on article cards', () => {
    const card = read('src/components/ArticleCard.astro');
    expect(card).not.toContain('busuanzi_container_page_pv');
    expect(card).not.toContain('busuanzi_value_page_pv');
  });

  it('keeps the eye and count vertically aligned after Busuanzi reveals the container', () => {
    const styles = read('src/styles/global.css');
    expect(styles).not.toMatch(/\.page-view-stat\s*\{[^}]*display:\s*inline-flex\s*!important;/s);
    expect(styles).toMatch(/\.page-view-stat:not\(\[style\*="display: none"\]\)\s*\{[^}]*display:\s*inline-flex\s*!important;/s);
    expect(styles).toMatch(/\.page-view-stat\s*\{[^}]*align-items:\s*center;/s);
    expect(styles).toMatch(/\.page-view-eye\s*\{[^}]*display:\s*block;/s);
  });
});
