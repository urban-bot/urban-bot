import { useBotContext } from './hooks';
import { formatMarkupLanguageElement, MARKDOWN_MODE } from '../utils/formatMarkupLanguageElement';

export function useFormatElement(element, parseMode) {
    const { parseMode: parseModeContext } = useBotContext();
    let finalParseMode = parseMode ?? parseModeContext;
    let formattedString;

    if (typeof children !== 'string' && typeof children !== 'number') {
        finalParseMode = finalParseMode ?? MARKDOWN_MODE;
        formattedString = formatMarkupLanguageElement(element, finalParseMode);
    } else {
        formattedString = formatMarkupLanguageElement(element);
    }

    return [formattedString, finalParseMode];
}
