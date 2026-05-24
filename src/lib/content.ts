import type { CollectionEntry } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';

export type BlogPost = CollectionEntry<'blog'>;

const CATEGORY_COLORS_PATH = path.resolve('./category-colors.json');

// 20个鲜艳互不相近的颜色池
export const COLOR_POOL = [
	'#E53935', // 红
	'#FB8C00', // 橙
	'#FDD835', // 明黄
	'#AEEA00', // 黄绿
	'#43A047', // 绿
	'#00BFA5', // 青绿
	'#00B0FF', // 天蓝
	'#2962FF', // 蓝
	'#7C4DFF', // 紫蓝
	'#D500F9', // 品红
	'#F50057', // 玫红
	'#795548', // 棕色
	'#5D4037', // 深棕
	'#00695C', // 深青
	'#1565C0', // 靛蓝
	'#00897B', // 蓝绿
	'#C62828', // 深红
	'#E64A19', // 橙红
	'#AD1457', // 深粉
	'#6A1B9A', // 紫色
];

function loadCategoryColors(): Record<string, string> {
	try {
		if (fs.existsSync(CATEGORY_COLORS_PATH)) {
			return JSON.parse(fs.readFileSync(CATEGORY_COLORS_PATH, 'utf-8'));
		}
	} catch {
		// ignore
	}
	return {};
}

function saveCategoryColors(colors: Record<string, string>) {
	fs.writeFileSync(CATEGORY_COLORS_PATH, JSON.stringify(colors, null, 2));
}

export function getCategoryColor(category: string): string {
	const colors = loadCategoryColors();
	if (colors[category]) {
		return colors[category];
	}
	// 新分类：随机从池子里取一个未使用的颜色
	const usedColors = new Set(Object.values(colors));
	const unusedColors = COLOR_POOL.filter(c => !usedColors.has(c));
	const nextColor = unusedColors[Math.floor(Math.random() * unusedColors.length)] || '#455A64';
	colors[category] = nextColor;
	saveCategoryColors(colors);
	return nextColor;
}

// 清理已不存在的分类，释放其颜色
export function pruneCategoryColors(actualCategories: string[]) {
	const colors = loadCategoryColors();
	const actual = new Set(actualCategories);
	const next = Object.fromEntries(Object.entries(colors).filter(([k]) => actual.has(k)));
	if (Object.keys(next).length !== Object.keys(colors).length) {
		saveCategoryColors(next);
	}
}

export function sortPosts(posts: BlogPost[]) {
	return [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function slugify(value: string) {
	const known: Record<string, string> = {
		AI: 'ai',
		技术: 'tech',
		写作: 'writing',
		设计: 'design',
		运维: 'ops',
		测试: 'test',
		部署: 'deploy',
		静态站点: 'static-site',
		知识库: 'knowledge-base',
		协作: 'collaboration',
		首页: 'home',
		体验: 'ux',
		发布: 'publish',
		检查清单: 'checklist',
		性能: 'performance',
		前端: 'frontend',
		后端: 'backend',
		创业: 'startup',
		生活: 'life',
		学术: 'academic',
		DevOps: 'devops',
		市场: 'marketing',
		产品: 'product',
		HR: 'hr',
		财务: 'finance',
		创意: 'creative',
		数据: 'data',
		运营: 'operations',
	};
	if (known[value]) return known[value];
	return value
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
}

export function formatDate(date: Date) {
	return new Intl.DateTimeFormat('zh-CN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(date);
}

export function countBy(posts: BlogPost[], getter: (post: BlogPost) => string | string[]) {
	const map = new Map<string, number>();
	for (const post of posts) {
		const values = getter(post);
		for (const value of Array.isArray(values) ? values : [values]) {
			map.set(value, (map.get(value) ?? 0) + 1);
		}
	}
	return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'));
}

export function postsByMonth(posts: BlogPost[]) {
	const groups = new Map<string, BlogPost[]>();
	for (const post of sortPosts(posts)) {
		const key = new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit' }).format(
			post.data.pubDate,
		);
		groups.set(key, [...(groups.get(key) ?? []), post]);
	}
	return [...groups.entries()];
}

// 20个固定颜色池，按色系排列
const TAG_COLOR_POOL = [
	'#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
	'#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
	'#8B5CF6', '#A855F7', '#C026D3', '#EC4899', '#F43F5E', '#64748B',
	'#6B7280', '#78716C',
];

function hashString(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
	}
	return Math.abs(hash);
}

// 获取标签颜色（通过哈希保证稳定）
export function getTagColor(tag: string): string {
	return TAG_COLOR_POOL[hashString(tag) % TAG_COLOR_POOL.length];
}