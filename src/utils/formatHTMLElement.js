import React from 'react';

export const MARKDOWN_MODE = 'markdown';
const HTML_MODE = 'HTML';

export function formatHTMLElement(element, parseMode = HTML_MODE) {
    if (Array.isArray(element)) {
        return element
            .map((child) => {
                return formatHTMLElement(child, parseMode);
            })
            .join('');
    }

    if (typeof element === 'number') {
        return String(element);
    }

    if (typeof element === 'string') {
        return element;
    }

    if (React.isValidElement(element)) {
        const text = formatHTMLElement(element.props.children, parseMode);

        switch (element.type) {
            case React.Fragment: {
                return text;
            }
            case 'b': {
                if (parseMode === 'markdown') {
                    return `*${text}*`;
                }

                return `<b>${text}</b>`;
            }
            case 'i': {
                if (parseMode === MARKDOWN_MODE) {
                    return `_${text}_`;
                }

                return `<i>${text}</i>`;
            }
            case 'u': {
                if (parseMode === MARKDOWN_MODE) {
                    return text;
                }

                return `<u>${text}</u>`;
            }
            case 's': {
                if (parseMode === MARKDOWN_MODE) {
                    return `~${text}~`;
                }

                return `<s>${text}</s>`;
            }
            case 'q': {
                if (parseMode === MARKDOWN_MODE) {
                    return `> ${text}`;
                }

                return `<q>${text}</q>`;
            }
            case 'code': {
                if (parseMode === MARKDOWN_MODE) {
                    return `\`${text}\``;
                }

                return `<code>${text}</code>`;
            }
            case 'pre': {
                if (parseMode === MARKDOWN_MODE) {
                    return `\`\`\`${text}\`\`\``;
                }

                return `<pre>${text}</pre>`;
            }
            case 'br': {
                return '\n';
            }
            case 'a': {
                const { href } = element.props;

                if (parseMode === MARKDOWN_MODE) {
                    return `<${href}|${text}>`;
                }

                return `<a href="${href}">${text}</a>`;
            }
            default: {
                throw new Error(`tag ${element.type} does not exist`);
            }
        }
    }

    return '';
}
