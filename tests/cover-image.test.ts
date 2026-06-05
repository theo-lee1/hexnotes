import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

describe('optional article covers', () => {
  it('renders an optional cover in article cards without changing coverless cards', () => {
    const source = read('src/components/ArticleCard.astro');
    const head = read('src/components/BaseHead.astro');
    const styles = read('src/styles/global.css');
    expect(source).toContain("{post.data.heroImage &&");
    expect(source).toContain('note-card-cover');
    expect(source).toContain("'has-cover': post.data.heroImage");
    expect(styles).toMatch(/\.note-card\.article-card-concept-index-slab\.has-cover \.note-card-cover\s*\{\s*grid-area:\s*cover;\s*position:\s*absolute;/);
    expect(styles).toMatch(/\.note-card\.article-card-concept-index-slab\.has-cover \.note-card-bottom\s*\{[^}]*width:\s*100%;/s);
    expect(styles).toMatch(/\.note-card\.article-card-concept-index-slab\.has-cover\s*\{[^}]*min-height:\s*210px;/s);
    expect(styles).toMatch(/\.note-card\.article-card-concept-index-slab\.has-cover \.note-card-cover\s*\{[^}]*opacity:\s*0\.24;/s);
    expect(styles).toMatch(/\.note-card\.article-card-concept-index-slab\.has-cover:hover \.note-card-cover\s*\{[^}]*opacity:\s*0\.82;/s);
    expect(head).toContain('data-critical-card-layout');
    expect(head).toMatch(/\.note-card\.has-cover \.note-card-cover\s*\{[^}]*position:\s*absolute;/s);
  });

  it('renders the cover as a separate banner between the detail header and body', () => {
    const source = read('src/layouts/BlogPost.astro');
    expect(source).toContain('reading-cover-banner');
    expect(source).toContain("{post.data.heroImage &&");
    expect(source).not.toContain("'has-cover': post.data.heroImage");
  });

  it('passes the article cover to social metadata', () => {
    const layout = read('src/layouts/BlogPost.astro');
    const head = read('src/components/BaseHead.astro');
    expect(layout).toContain('image={post.data.heroImage ? withBase(post.data.heroImage) : undefined}');
    expect(head).toContain('<meta property="og:image"');
    expect(head).toContain('summary_large_image');
  });

  it('keeps search result cards consistent with optional covers', () => {
    const source = read('src/pages/search.astro');
    expect(source).toContain('heroImage: p.data.heroImage ? `${baseUrl}${p.data.heroImage}` : undefined');
    expect(source).toContain('note-card-cover');
  });
});
