import type { CollectionEntry } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';

export type BlogPost = CollectionEntry<'blog'>;

function resolveContentDir() {
	const configured = process.env.CONTENT_DIR;
	if (configured && fs.existsSync(configured)) return configured;
	if (fs.existsSync('./content')) return './content';
	return './src/content';
}

function resolveCategoryColorsPath() {
	return path.resolve(resolveContentDir(), 'category-colors.json');
}

// 分类颜色池 - 精选风格
export const COLOR_POOL = [
	'#22D3EE', // 湖蓝
	'#FF9F43', // 橙
	'#C084FC', // 洋红
	'#4ADE80', // 绿
	'#FF003C', // 深红
	'#60A5FA', // 蓝
	'#F8B4FF', // 浅粉
	'#84CC16', // 青柠
	'#FF4D00', // 橙红
	'#2979FF', // 天蓝
	'#FB7185', // 珊瑚
	'#455A64', // 蓝灰
	'#FFF000', // 亮黄
	'#FF5C5C', // 红
	'#8000FF', // 紫
	'#FF2BD6', // 品红
	'#C1FF72', // 浅绿
	'#F97316', // 深橙
	'#DDDDDD', // 浅灰
	'#FF3300', // 橙红
	'#FF007A', // 深粉
];

function loadCategoryColors(): Record<string, string> {
	const categoryColorsPath = resolveCategoryColorsPath();
	try {
		if (fs.existsSync(categoryColorsPath)) {
			return JSON.parse(fs.readFileSync(categoryColorsPath, 'utf-8'));
		}
	} catch {
		// ignore
	}
	return {};
}

function saveCategoryColors(colors: Record<string, string>) {
	const categoryColorsPath = resolveCategoryColorsPath();
	fs.mkdirSync(path.dirname(categoryColorsPath), { recursive: true });
	fs.writeFileSync(categoryColorsPath, `${JSON.stringify(colors, null, 2)}\n`);
}

function pickNextCategoryColor(colors: Record<string, string>) {
	const usedColors = new Set(Object.values(colors));
	const unusedColor = COLOR_POOL.find((color) => !usedColors.has(color));
	return unusedColor ?? COLOR_POOL[Object.keys(colors).length % COLOR_POOL.length];
}

export function getCategoryColor(category: string): string {
	const colors = loadCategoryColors();
	if (colors[category]) {
		return colors[category];
	}
	const nextColor = pickNextCategoryColor(colors);
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
