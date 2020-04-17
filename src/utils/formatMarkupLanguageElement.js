import React from 'react';

export const MARKDOWN_MODE = 'markdown';
export const HTML_MODE = 'HTML';

function formatHTMLElement(element, text) {
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
        case 'q': {
            return `<q>${text}</q>`;
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
            const { href } = element.props;

            return `<a href="${href}">${text}</a>`;
        }
        default: {
            throw new Error(`tag ${element.type} does not exist`);
        }
    }
}

function formatMarkdownElement(element, text) {
    switch (element.type) {
        case React.Fragment: {
            return text;
        }
        case 'b': {
            return `*${text}*`;
        }
        case 'i': {
            return `_${text}_`;
        }
        case 'u': {
            return text;
        }
        case 's': {
            return `~${text}~`;
        }
        case 'q': {
            return `> ${text}`;
        }
        case 'code': {
            return `\`${text}\``;
        }
        case 'pre': {
            return `\`\`\`${text}\`\`\``;
        }
        case 'br': {
            return '\n';
        }
        case 'a': {
            const { href } = element.props;

            return `<${href}|${text}>`;
        }
        default: {
            throw new Error(`tag ${element.type} does not exist`);
        }
    }
}

export function formatMarkupLanguageElement(element, parseMode) {
    if (Array.isArray(element)) {
        return element
            .map((child) => {
                return formatMarkupLanguageElement(child, parseMode);
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
        const text = formatMarkupLanguageElement(element.props.children, parseMode);

        switch (parseMode) {
            case MARKDOWN_MODE: {
                return formatMarkdownElement(element, text);
            }
            case HTML_MODE: {
                return formatHTMLElement(element, text);
            }
            default: {
                throw new Error(
                    `parseMode '${parseMode}' doesn't exist. Please provide '${HTML_MODE}' or '${MARKDOWN_MODE}' parseMode`,
                );
            }
        }
    }

    return '';
}
