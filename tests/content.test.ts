import { describe, it, expect } from 'vitest';
import { slugify, getCategoryColor, COLOR_POOL } from '../src/lib/content';

describe('slugify', () => {
  it('使用已知映射转换中文分类', () => {
    expect(slugify('技术')).toBe('tech');
    expect(slugify('AI')).toBe('ai');
    expect(slugify('前端')).toBe('frontend');
  });

  it('转换未知字符串为小写连字符格式', () => {
    expect(slugify('Some Title')).toBe('some-title');
    expect(slugify('hello world')).toBe('hello-world');
  });

  it('处理纯英文字符串', () => {
    expect(slugify('test')).toBe('test');
    expect(slugify('Multiple Words')).toBe('multiple-words');
  });
});

describe('getCategoryColor', () => {
  it('已知分类返回颜色池中的颜色', () => {
    const color1 = getCategoryColor('技术');
    const color2 = getCategoryColor('技术');
    expect(color1).toBe(color2);
    expect(COLOR_POOL).toContain(color1);
  });

  it('未知分类返回颜色池中的颜色', () => {
    const color1 = getCategoryColor('某个未知分类');
    const color2 = getCategoryColor('某个未知分类');
    expect(color1).toBe(color2);
    expect(COLOR_POOL).toContain(color1);
  });
});