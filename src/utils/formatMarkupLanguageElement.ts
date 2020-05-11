import React from 'react';

export const MARKDOWN_MODE = 'markdown';
export const HTML_MODE = 'HTML';

function formatHTMLElement(element: React.ReactElement<React.PropsWithChildren<unknown>>, text: string): string {
    switch (element.type) {
        case React.Fragment: {
            return text;
        }
        case 'b': {
            return `<b>${text}</b>`;
        }
        case 'strong': {
            return `<strong>${text}</strong>`;
        }
        case 'i': {
            return `<i>${text}</i>`;
        }
        case 'em': {
            return `<em>${text}</em>`;
        }
        case 'u': {
            return `<u>${text}</u>`;
        }
        case 'ins': {
            return `<ins>${text}</ins>`;
        }
        case 's': {
            return `<s>${text}</s>`;
        }
        case 'strike': {
            return `<strike>${text}</strike>`;
        }
        case 'del': {
            return `<del>${text}</del>`;
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
            const { href } = element.props as { href: string };

            return `<a href="${href}">${text}</a>`;
        }
        default: {
            throw new Error(`tag ${element.type} does not exist`);
        }
    }
}

function formatMarkdownElement(element: React.ReactElement, text: string): string {
    switch (element.type) {
        case React.Fragment: {
            return text;
        }
        case 'b': {
            return `*${text}*`;
        }
        case 'strong': {
            return `*${text}*`;
        }
        case 'i': {
            return `_${text}_`;
        }
        case 'em': {
            return `_${text}_`;
        }
        case 'u': {
            return text;
        }
        case 'ins': {
            return text;
        }
        case 's': {
            return `~${text}~`;
        }
        case 'strike': {
            return `~${text}~`;
        }
        case 'del': {
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

export function formatMarkupLanguageElement(
    element: React.ReactNode,
    parseMode?: typeof HTML_MODE | typeof MARKDOWN_MODE,
): string {
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

    if (React.isValidElement<React.PropsWithChildren<unknown>>(element)) {
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
