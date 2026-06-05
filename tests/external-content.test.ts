import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

describe('external content repository integration', () => {
  it('loads Astro content from a configurable external content directory with a local fallback', () => {
    const config = read('src/content.config.ts');

    expect(config).toContain('resolveContentDir');
    expect(config).toContain("process.env.CONTENT_DIR");
    expect(config).toContain("'./content'");
    expect(config).toContain("'./src/content'");
    expect(config).toContain('base: blogContentDir');
    expect(config).toContain('base: pagesContentDir');
  });

  it('uses the same resolved content directory for category cleanup and image sync', () => {
    const astroConfig = read('astro.config.mjs');

    expect(astroConfig).toContain('resolveContentDir');
    expect(astroConfig).toContain('const CONTENT_DIR = resolveContentDir()');
    expect(astroConfig).toContain("const BLOG_DIR = path.join(CONTENT_DIR, 'blog')");
    expect(astroConfig).toContain("const CONTENT_IMAGES_DIR = path.join(CONTENT_DIR, 'images')");
    expect(astroConfig).toContain("const PUBLIC_IMAGES_DIR = path.resolve('./public/images')");
    expect(astroConfig).toContain("fs.rmSync(PUBLIC_IMAGES_DIR, { recursive: true, force: true })");
    expect(astroConfig).toContain('syncContentImages()');
  });

  it('checks out the public content repository before the production build', () => {
    const workflow = read('.github/workflows/deploy.yml');

    expect(workflow).toContain('repository_dispatch');
    expect(workflow).toContain('content-updated');
    expect(workflow).toContain('theo-lee1/hexnotes-content');
    expect(workflow).toContain('path: content');
    expect(workflow).toContain('token: ${{ secrets.HEXNOTES_CONTENT_TOKEN }}');
    expect(workflow).toContain('CONTENT_DIR: ./content');
  });

  it('documents that publishing articles happens in the content repository', () => {
    const readme = read('README.md');
    const gitignore = read('.gitignore');

    expect(readme).toContain('hexnotes-content');
    expect(readme).toContain('content/blog/');
    expect(readme).toContain('content/images/');
    expect(readme).toContain('/images/');
    expect(readme).toContain('content-updated');
    expect(gitignore).toContain('content/');
    expect(gitignore).toContain('public/images/');
  });
});
