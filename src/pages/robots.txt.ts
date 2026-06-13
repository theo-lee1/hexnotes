export function GET({ site }) {
	const origin = site?.origin ?? 'https://www.hexnotes.cc';
	const base = import.meta.env.BASE_URL.replace(/\/$/, '');
	const body = [
		'User-agent: *',
		'Allow: /',
		`Sitemap: ${origin}${base}/sitemap-index.xml`,
		'',
	].join('\n');

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
}
