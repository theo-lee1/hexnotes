import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

function resolveContentDir() {
	const configured = process.env.CONTENT_DIR;
	if (configured && fs.existsSync(configured)) return configured;
	if (fs.existsSync('./content')) return './content';
	return './src/content';
}

function toGlobBase(dir: string) {
	return path.isAbsolute(dir) ? pathToFileURL(path.resolve(dir)).href : dir;
}

const contentDir = toGlobBase(resolveContentDir());
const blogContentDir = `${contentDir}/blog`;
const pagesContentDir = `${contentDir}/pages`;

const blog = defineCollection({
	loader: glob({ base: blogContentDir, pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			category: z.string(),
			tags: z.array(z.string()).default([]),
			draft: z.boolean().default(false),
			accent: z.string().default('#38cfff'),
			featured: z.boolean().default(false),
			heroImage: z.string().optional(),
		}),
});

const pages = defineCollection({
	loader: glob({ base: pagesContentDir, pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
	}),
});

export const collections = { blog, pages };
