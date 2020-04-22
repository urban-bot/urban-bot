import { useBotContext } from './hooks';
import { formatMarkupLanguageElement, Element } from '../utils/formatMarkupLanguageElement';
import { UrbanParseMode } from '../types';

export function useFormatElement(element: Element, parseMode?: UrbanParseMode): [string, UrbanParseMode] {
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
