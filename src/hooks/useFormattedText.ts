import { useBotContext } from './hooks';
import { formatMarkupLanguageElement } from '../utils/formatMarkupLanguageElement';
import { UrbanParseMode } from '../types';
import { ReactNode } from 'react';

export function useFormattedText(element: ReactNode, parseMode?: UrbanParseMode): [string, UrbanParseMode] {
    const { parseMode: parseModeContext } = useBotContext();
    const finalParseMode = parseMode ?? parseModeContext;
    let formattedString;

    if (typeof element !== 'string' && typeof element !== 'number') {
        formattedString = formatMarkupLanguageElement(element, finalParseMode);
    } else {
        formattedString = formatMarkupLanguageElement(element);
    }

    return [formattedString, finalParseMode];
}
