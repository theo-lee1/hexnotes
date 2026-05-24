import { visit } from 'unist-util-visit';

/**
 * Custom rehype plugin to handle superscript (^text^) and subscript (~text~)
 */
export function rehypeSupersubSubscript() {
	return (tree) => {
		visit(tree, 'element', (node) => {
			if (node.tagName !== 'p') return;

			// Step 1: Merge adjacent text nodes
			const newChildren = [];
			let currentText = null;

			for (const child of node.children) {
				if (child.type === 'text') {
					if (currentText) {
						currentText.value += child.value;
					} else {
						currentText = { type: 'text', value: child.value };
						newChildren.push(currentText);
					}
				} else {
					if (currentText) {
						currentText = null;
					}
					newChildren.push(child);
				}
			}
			node.children = newChildren;

			// Step 2: Process superscript ^text^ and subscript ~text~
			for (let i = 0; i < node.children.length; i++) {
				const child = node.children[i];

				// Process superscript ^text^
				if (child.type === 'text' && child.value.includes('^')) {
					const parts = child.value.split('^');
					if (parts.length >= 3 && parts.length % 2 === 1) {
						const replacement = [];
						for (let j = 0; j < parts.length; j++) {
							// Even index (0, 2, 4...): text before/after marker
							// Odd index (1, 3, 5...): content between markers
							if (j % 2 === 0) {
								// Even index: text content - only add if non-empty and not after a marker position
								// (markers are at odd indices in split result, so even indices after 0 are "after marker")
								if (parts[j] && j > 0) {
									replacement.push({ type: 'text', value: parts[j] });
								} else if (parts[j] && j === 0) {
									replacement.push({ type: 'text', value: parts[j] });
								}
							} else {
								// Odd index: content between markers - wrap in sup if non-empty
								if (parts[j]) {
									replacement.push({
										type: 'element',
										tagName: 'sup',
										properties: {},
										children: [{ type: 'text', value: parts[j] }]
									});
								}
							}
						}
						node.children.splice(i, 1, ...replacement);
						i += replacement.length - 1;
					}
				}

				// Process subscript ~text~
				if (child.type === 'text' && child.value.includes('~')) {
					const parts = child.value.split('~');
					if (parts.length >= 3 && parts.length % 2 === 1) {
						const replacement = [];
						for (let j = 0; j < parts.length; j++) {
							if (j % 2 === 0) {
								// Even index: text content - only add if non-empty
								if (parts[j] && j > 0) {
									replacement.push({ type: 'text', value: parts[j] });
								} else if (parts[j] && j === 0) {
									replacement.push({ type: 'text', value: parts[j] });
								}
							} else {
								// Odd index: content between markers - wrap in sub if non-empty
								if (parts[j]) {
									replacement.push({
										type: 'element',
										tagName: 'sub',
										properties: {},
										children: [{ type: 'text', value: parts[j] }]
									});
								}
							}
						}
						node.children.splice(i, 1, ...replacement);
						i += replacement.length - 1;
					}
				}
			}
		});
	};
}