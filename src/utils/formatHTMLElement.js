import React from 'react';

export function formatHTMLElement(element, parseMode = 'HTML') {
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
                if (parseMode === 'markdown') {
                    return `_${text}_`;
                }

                return `<i>${text}</i>`;
            }
            case 'u': {
                if (parseMode === 'markdown') {
                    return text;
                }

                return `<u>${text}</u>`;
            }
            case 's': {
                if (parseMode === 'markdown') {
                    return `~${text}~`;
                }

                return `<s>${text}</s>`;
            }
            case 'code': {
                if (parseMode === 'markdown') {
                    return `\`${text}\``;
                }

                return `<code>${text}</code>`;
            }
            case 'pre': {
                if (parseMode === 'markdown') {
                    return `\`\`\`${text}\`\`\``;
                }

                return `<pre>${text}</pre>`;
            }
            case 'br': {
                return '\n';
            }
            case 'a': {
                const { href } = element.props;

                if (parseMode === 'markdown') {
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
