import React from 'react';

export function formatElementToHTML(element) {
    if (Array.isArray(element)) {
        return element
            .map((child) => {
                return formatElementToHTML(child);
            })
            .join('');
    }

    if (typeof element === 'string') {
        return element;
    }

    if (React.isValidElement(element)) {
        const text = formatElementToHTML(element.props.children);

        switch (element.type) {
            case React.Fragment: {
                return text;
            }
            case 'b': {
                return `<b>${text}</b>`;
            }
            case 'i': {
                return `<i>${text}</i>`;
            }
            case 'u': {
                return `<u>${text}</u>`;
            }
            case 's': {
                return `<s>${text}</s>`;
            }
            case 'code': {
                return `<code>${text}</code>`;
            }
            case 'pre': {
                return `<pre>${text}</pre>`;
            }
            case 'br': {
                return '\n';
            }
            case 'a': {
                const { href, userId } = element.props;

                if (href) {
                    return `<a href="${href}">${text}</a>`;
                }

                if (userId) {
                    return `<a href="tg://user?id=${userId}">${text}</a>`;
                }

                return '';
            }
            default: {
                throw new Error(`tag ${element.type} does not exist`);
            }
        }
    }

    return '';
}
