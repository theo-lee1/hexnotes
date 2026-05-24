import { describe, it, expect } from 'vitest';

function slugify(value) {
  const known = {
    'AI': 'ai', '技术': 'tech', '写作': 'writing', '设计': 'design',
    '运维': 'ops', '测试': 'test', '部署': 'deploy', '静态站点': 'static-site',
    '知识库': 'knowledge-base', '协作': 'collaboration', '首页': 'home',
    '体验': 'ux', '发布': 'publish', '检查清单': 'checklist', '性能': 'performance',
    '前端': 'frontend', '后端': 'backend', '创业': 'startup', '生活': 'life',
    '学术': 'academic', 'DevOps': 'devops', '市场': 'marketing', '产品': 'product',
    'HR': 'hr', '财务': 'finance', '创意': 'creative', '数据': 'data',
    '运营': 'operations',
  };
  if (known[value]) return known[value];
  return value.trim().toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function searchPosts(query, posts) {
  if (!query.trim()) return [];
  const keyword = query.trim().toLowerCase();
  return posts.filter(post =>
    post.data.title.toLowerCase().includes(keyword) ||
    post.data.description.toLowerCase().includes(keyword) ||
    post.data.category.toLowerCase().includes(keyword) ||
    post.data.tags.some(t => t.toLowerCase().includes(keyword))
  );
}

function getPages(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) {
    const pages = [1, 2, 3, 4, 5];
    if (total > 6) pages.push('...');
    pages.push(total);
    return pages;
  }
  if (current >= total - 3) {
    const pages = [1];
    if (total > 6) pages.push('...');
    for (let i = total - 4; i <= total; i++) pages.push(i);
    return pages;
  }
  return [1, '...', current - 1, current, current + 1, '...', total];
}

const mockPosts = [
  { data: { title: '测试文章', description: '这是一个测试', category: '技术', tags: ['前端', 'Vue'] } },
  { data: { title: '另一个文章', description: '描述内容', category: '前端', tags: ['React'] } },
  { data: { title: 'AI 入门指南', description: '人工智能基础', category: 'AI', tags: ['机器学习'] } },
];

describe('slugify', () => {
  it('转换中文分类', () => {
    expect(slugify('技术')).toBe('tech');
    expect(slugify('前端')).toBe('frontend');
    expect(slugify('AI')).toBe('ai');
  });

  it('转换英文字符串为连字符格式', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });
});

describe('searchPosts', () => {
  it('空查询返回空数组', () => {
    expect(searchPosts('', mockPosts)).toEqual([]);
    expect(searchPosts('   ', mockPosts)).toEqual([]);
  });

  it('按标题搜索', () => {
    const result = searchPosts('测试', mockPosts);
    expect(result).toHaveLength(1);
    expect(result[0].data.title).toBe('测试文章');
  });

  it('按分类搜索', () => {
    const result = searchPosts('前端', mockPosts);
    expect(result).toHaveLength(2);
  });

  it('按标签搜索', () => {
    const result = searchPosts('Vue', mockPosts);
    expect(result).toHaveLength(1);
  });

  it('搜索不区分大小写', () => {
    const result = searchPosts('AI', mockPosts);
    expect(result).toHaveLength(1);
  });
});

describe('getPages', () => {
  it('总页数<=5时返回所有页码', () => {
    expect(getPages(1, 3)).toEqual([1, 2, 3]);
  });

  it('当前页<=4时显示前5页和省略号', () => {
    const result = getPages(2, 10);
    expect(result).toEqual([1, 2, 3, 4, 5, '...', 10]);
  });

  it('当前页>=total-3时显示省略号和后5页', () => {
    const result = getPages(9, 10);
    expect(result).toEqual([1, '...', 6, 7, 8, 9, 10]);
  });

  it('中间页时正确生成省略号', () => {
    const result = getPages(5, 10);
    expect(result).toEqual([1, '...', 4, 5, 6, '...', 10]);
  });
});