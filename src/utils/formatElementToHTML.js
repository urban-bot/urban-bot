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

        if (element.type === 'b') {
            return `<b>${text}</b>`;
        }

        if (element.type === 'i') {
            return `<i>${text}</i>`;
        }

        if (element.type === 'u') {
            return `<u>${text}</u>`;
        }

        if (element.type === 's') {
            return `<s>${text}</s>`;
        }

        if (element.type === 'code') {
            return `<code>${text}</code>`;
        }

        if (element.type === 'pre') {
            return `<pre>${text}</pre>`;
        }

        if (element.type === 'br') {
            return '\n';
        }

        if (element.type === 'a') {
            const { href, userId } = element.props;

            if (href) {
                return `<a href="${href}">${text}</a>`;
            }

            if (userId) {
                return `<a href="tg://user?id=${userId}">${text}</a>`;
            }

            return '';
        }

        throw new Error('tag does not exist');
    }

    return '';
}
