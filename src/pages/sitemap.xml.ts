import { getCollection } from 'astro:content';
import { slugify, sortPosts } from '../lib/content';
import { withBase } from '../lib/urls';

function absoluteUrl(path: string, site: URL) {
	return new URL(withBase(path), site).toString();
}

function escapeXml(value: string) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function urlEntry(loc: string, lastmod?: Date) {
	const parts = [`<loc>${escapeXml(loc)}</loc>`];
	if (lastmod) {
		parts.push(`<lastmod>${lastmod.toISOString()}</lastmod>`);
	}
	return `<url>${parts.join('')}</url>`;
}

export async function GET({ site }) {
	const origin = site ?? new URL('https://www.hexnotes.cc');
	const posts = sortPosts(await getCollection('blog', ({ data }) => !data.draft));
	const categories = [...new Set(posts.map((post) => post.data.category))];
	const tags = [...new Set(posts.flatMap((post) => post.data.tags))];
	const latestPostDate = posts[0]?.data.pubDate;

	const staticPaths = ['/', '/blog/', '/categories/', '/tags/', '/archive/', '/about/'];
	const urls = [
		...staticPaths.map((path) => urlEntry(absoluteUrl(path, origin), latestPostDate)),
		...posts.map((post) => urlEntry(absoluteUrl(`/blog/${post.id}/`, origin), post.data.updatedDate ?? post.data.pubDate)),
		...categories.map((category) => urlEntry(absoluteUrl(`/categories/${slugify(category)}/`, origin), latestPostDate)),
		...tags.map((tag) => urlEntry(absoluteUrl(`/tags/${slugify(tag)}/`, origin), latestPostDate)),
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
		},
	});
}
