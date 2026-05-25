export function GET({ site }) {
	const origin = site?.origin ?? 'https://www.hexnotes.cc';
	const body = [
		'User-agent: *',
		'Allow: /',
		`Sitemap: ${origin}/sitemap-index.xml`,
		`Sitemap: ${origin}/rss.xml`,
		'',
	].join('\n');

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
}
