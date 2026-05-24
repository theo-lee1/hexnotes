import { visit } from 'unist-util-visit';

/**
 * Custom remark plugin to handle superscript (^text^) and subscript (~text~)
 * Works alongside remark-gfm without conflicts
 */
export function remarkSuperscriptSubscript() {
	return (tree) => {
		const changes = [];

		visit(tree, 'text', (node, index, parent) => {
			if (!node.value || !parent || index === undefined) return;

			const value = node.value;

			// Process superscript ^text^
			if (value.includes('^') && !value.includes('^^')) {
				const parts = value.split('^');
				// Need odd number of parts for valid superscript (3+ parts = 1 pair, 5 = 2 pairs, etc)
				if (parts.length >= 3 && parts.length % 2 === 1) {
					const newNodes = [];
					for (let i = 0; i < parts.length; i++) {
						if (parts[i]) {
							newNodes.push({ type: 'text', value: parts[i] });
						}
						if (i < parts.length - 1) {
							newNodes.push({
								type: 'superscript',
								data: { hName: 'sup' },
								children: [{ type: 'text', value: parts[i + 1] }]
							});
						}
					}
					changes.push({ parent, index, nodes: newNodes });
				}
			}

			// Process subscript ~text~ (but not ~~ which is strikethrough)
			if (value.includes('~') && !value.includes('~~')) {
				const parts = value.split('~');
				if (parts.length >= 3 && parts.length % 2 === 1) {
					const newNodes = [];
					for (let i = 0; i < parts.length; i++) {
						if (parts[i]) {
							newNodes.push({ type: 'text', value: parts[i] });
						}
						if (i < parts.length - 1) {
							newNodes.push({
								type: 'subscript',
								data: { hName: 'sub' },
								children: [{ type: 'text', value: parts[i + 1] }]
							});
						}
					}
					changes.push({ parent, index, nodes: newNodes });
				}
			}
		});

		// Apply changes in reverse order to preserve indices
		changes.sort((a, b) => b.index - a.index);
		for (const change of changes) {
			change.parent.children.splice(change.index, 1, ...change.nodes);
		}
	};
}