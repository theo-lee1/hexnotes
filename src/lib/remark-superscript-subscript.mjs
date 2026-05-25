import { visit } from 'unist-util-visit';

const INLINE_MARKERS = [
	{ marker: '==', type: 'highlight', hName: 'mark' },
	{ marker: '^', type: 'superscript', hName: 'sup' },
	{ marker: '~', type: 'subscript', hName: 'sub' },
];

function findNextMarker(value, start) {
	let next = null;
	for (const marker of INLINE_MARKERS) {
		const index = value.indexOf(marker.marker, start);
		if (index === -1) continue;
		if (!next || index < next.index || (index === next.index && marker.marker.length > next.marker.marker.length)) {
			next = { index, marker };
		}
	}
	return next;
}

function parseExtendedInline(value) {
	const nodes = [];
	let cursor = 0;

	while (cursor < value.length) {
		const next = findNextMarker(value, cursor);
		if (!next) {
			nodes.push({ type: 'text', value: value.slice(cursor) });
			break;
		}

		const { marker } = next;
		const markerText = marker.marker;
		const contentStart = next.index + markerText.length;
		const close = value.indexOf(markerText, contentStart);

		if (close === -1) {
			nodes.push({ type: 'text', value: value.slice(cursor) });
			break;
		}

		const content = value.slice(contentStart, close);
		if (!content.trim()) {
			nodes.push({ type: 'text', value: value.slice(cursor, close + markerText.length) });
			cursor = close + markerText.length;
			continue;
		}

		if (next.index > cursor) {
			nodes.push({ type: 'text', value: value.slice(cursor, next.index) });
		}

		nodes.push({
			type: marker.type,
			data: { hName: marker.hName },
			children: [{ type: 'text', value: content }],
		});

		cursor = close + markerText.length;
	}

	return nodes;
}

export function remarkSuperscriptSubscript() {
	return (tree) => {
		const changes = [];

		visit(tree, 'text', (node, index, parent) => {
			if (!node.value || !parent || index === undefined) return;
			if (!INLINE_MARKERS.some(({ marker }) => node.value.includes(marker))) return;
			if (node.value.includes('~~')) return;

			const nodes = parseExtendedInline(node.value).filter((item) => item.value !== '');
			if (nodes.length > 1 || nodes[0]?.type !== 'text') {
				changes.push({ parent, index, nodes });
			}
		});

		changes.sort((a, b) => b.index - a.index);
		for (const change of changes) {
			change.parent.children.splice(change.index, 1, ...change.nodes);
		}
	};
}
