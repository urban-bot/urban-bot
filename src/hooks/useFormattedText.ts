import { useBotContext } from './hooks';
import { formatMarkupLanguageElement } from '../utils/formatMarkupLanguageElement';
import { UrbanParseMode } from '../types';
import { ReactNode } from 'react';

export function useFormattedText(element: ReactNode, parseMode?: UrbanParseMode): [string, UrbanParseMode | undefined] {
    // TODO remove useBotContext outside
    const { parseMode: parseModeContext } = useBotContext();
    const finalParseMode = parseMode ?? parseModeContext;
    let formattedText;

    if (typeof element !== 'string' && typeof element !== 'number') {
        formattedText = formatMarkupLanguageElement(element, finalParseMode);
    } else {
        formattedText = formatMarkupLanguageElement(element);
    }

    return [formattedText, finalParseMode];
}
