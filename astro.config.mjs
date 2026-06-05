// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import remarkGfm from 'remark-gfm';
import { remarkSuperscriptSubscript } from './src/lib/remark-superscript-subscript.mjs';
import fs from 'node:fs';
import path from 'node:path';

const site = process.env.SITE_URL ?? 'https://www.hexnotes.cc';
const base = process.env.BASE_PATH;

function resolveContentDir() {
	const configured = process.env.CONTENT_DIR;
	if (configured && fs.existsSync(configured)) return configured;
	if (fs.existsSync('./content')) return './content';
	return './src/content';
}

const CONTENT_DIR = resolveContentDir();

// 构建前清理 category-colors.json 中已不存在的分类
const CATEGORY_COLORS_PATH = path.resolve('./category-colors.json');
const BLOG_DIR = path.join(CONTENT_DIR, 'blog');
const CONTENT_IMAGES_DIR = path.join(CONTENT_DIR, 'images');
const PUBLIC_IMAGES_DIR = path.resolve('./public/images');

function loadCategoryColors() {
	try {
		if (fs.existsSync(CATEGORY_COLORS_PATH)) {
			return JSON.parse(fs.readFileSync(CATEGORY_COLORS_PATH, 'utf-8'));
		}
	} catch {}
	return {};
}

function getActualCategories() {
	try {
		return fs.readdirSync(BLOG_DIR, { recursive: true })
			.filter(f => typeof f === 'string' && (f.endsWith('.md') || f.endsWith('.mdx')))
			.map(f => {
				const src = fs.readFileSync(path.join(BLOG_DIR, f), 'utf-8');
				const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
				if (!match) return null;
				if (/^draft:\s*true\s*$/m.test(match[1])) return null;
				const catMatch = match[1].match(/^category:\s*(.+)$/m);
				return catMatch ? catMatch[1].trim() : null;
			})
			.filter(Boolean);
	} catch {
		return [];
	}
}

function syncContentImages() {
	fs.rmSync(PUBLIC_IMAGES_DIR, { recursive: true, force: true });
	if (!fs.existsSync(CONTENT_IMAGES_DIR)) return;
	fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
	fs.cpSync(CONTENT_IMAGES_DIR, PUBLIC_IMAGES_DIR, { recursive: true });
}

// 自定义集成用于在构建前执行清理
function contentRepositoryIntegration() {
	return {
		name: 'content-repository',
		hooks: {
			'astro:build:start'() {
				const CATEGORY_COLORS_PATH = path.resolve('./category-colors.json');
				syncContentImages();
				const cats = getActualCategories();
				const colors = loadCategoryColors();
				const next = Object.fromEntries(
					Object.entries(colors).filter(([k]) => cats.includes(k))
				);
				if (Object.keys(next).length !== Object.keys(colors).length) {
					fs.writeFileSync(CATEGORY_COLORS_PATH, JSON.stringify(next, null, 2));
				}
			},
		},
	};
}

// https://astro.build/config
export default defineConfig({
	site,
	base,
	integrations: [mdx(), sitemap(), contentRepositoryIntegration()],
	markdown: {
		remarkPlugins: [[remarkGfm, { singleTilde: false }], remarkSuperscriptSubscript],
		shikiConfig: {
			theme: 'catppuccin-mocha',
		},
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
