import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const originalContentDir = process.env.CONTENT_DIR;

async function loadContentLib() {
  vi.resetModules();
  return import('../src/lib/content');
}

function makeContentDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hexnotes-content-'));
  fs.mkdirSync(path.join(dir, 'blog'), { recursive: true });
  process.env.CONTENT_DIR = dir;
  return dir;
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  if (originalContentDir === undefined) {
    delete process.env.CONTENT_DIR;
  } else {
    process.env.CONTENT_DIR = originalContentDir;
  }
  vi.resetModules();
});

describe('slugify', () => {
  it('使用已知映射转换中文分类', async () => {
    const { slugify } = await loadContentLib();

    expect(slugify('技术')).toBe('tech');
    expect(slugify('AI')).toBe('ai');
    expect(slugify('前端')).toBe('frontend');
  });

  it('转换未知字符串为小写连字符格式', async () => {
    const { slugify } = await loadContentLib();

    expect(slugify('Some Title')).toBe('some-title');
    expect(slugify('hello world')).toBe('hello-world');
  });

  it('处理纯英文字符串', async () => {
    const { slugify } = await loadContentLib();

    expect(slugify('test')).toBe('test');
    expect(slugify('Multiple Words')).toBe('multiple-words');
  });
});

describe('getCategoryColor', () => {
  it('已知分类返回颜色池中的颜色', async () => {
    makeContentDir();
    const { getCategoryColor, COLOR_POOL } = await loadContentLib();

    const color1 = getCategoryColor('技术');
    const color2 = getCategoryColor('技术');
    expect(color1).toBe(color2);
    expect(COLOR_POOL).toContain(color1);
  });

  it('未知分类返回颜色池中的颜色', async () => {
    makeContentDir();
    const { getCategoryColor, COLOR_POOL } = await loadContentLib();

    const color1 = getCategoryColor('某个未知分类');
    const color2 = getCategoryColor('某个未知分类');
    expect(color1).toBe(color2);
    expect(COLOR_POOL).toContain(color1);
  });

  it('writes category colors into the configured content repository', async () => {
    const contentDir = makeContentDir();
    const { getCategoryColor } = await loadContentLib();

    getCategoryColor('日常');

    expect(fs.existsSync(path.join(contentDir, 'category-colors.json'))).toBe(true);
  });

  it('assigns unused colors in fixed pool order and reuses only after the pool is exhausted', async () => {
    makeContentDir();
    const { COLOR_POOL, getCategoryColor } = await loadContentLib();

    const assigned = COLOR_POOL.map((_, index) => getCategoryColor(`分类 ${index + 1}`));
    const reused = getCategoryColor('超出颜色池');

    expect(assigned).toEqual(COLOR_POOL);
    expect(reused).toBe(COLOR_POOL[0]);
  });

  it('prunes deleted categories so their colors become available again', async () => {
    makeContentDir();
    const { COLOR_POOL, getCategoryColor, pruneCategoryColors } = await loadContentLib();

    expect(getCategoryColor('保留')).toBe(COLOR_POOL[0]);
    expect(getCategoryColor('删除')).toBe(COLOR_POOL[1]);

    pruneCategoryColors(['保留']);

    expect(getCategoryColor('新分类')).toBe(COLOR_POOL[1]);
  });
});
