import { useBotContext } from './hooks';
import { formatMarkupLanguageElement, Element, MARKDOWN_MODE } from '../utils/formatMarkupLanguageElement';
import { UrbanParseMode } from '../types';

export function useFormatElement(element: Element, parseMode?: UrbanParseMode): [string, UrbanParseMode] {
    const { parseMode: parseModeContext } = useBotContext();
    let finalParseMode = parseMode ?? parseModeContext;
    let formattedString;

    if (typeof element !== 'string' && typeof element !== 'number') {
        finalParseMode = finalParseMode ?? MARKDOWN_MODE;
        formattedString = formatMarkupLanguageElement(element, finalParseMode);
    } else {
        formattedString = formatMarkupLanguageElement(element);
    }

    return [formattedString, finalParseMode];
}
