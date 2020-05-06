import { formatMarkupLanguageElement } from './formatMarkupLanguageElement';
import { UrbanParseMode } from '../types';
import { ReactNode } from 'react';

export function formatText(element: ReactNode, parseMode?: UrbanParseMode): string {
    let formattedText;

    if (typeof element !== 'string' && typeof element !== 'number') {
        formattedText = formatMarkupLanguageElement(element, parseMode);
    } else {
        formattedText = formatMarkupLanguageElement(element);
    }

    return formattedText;
}
