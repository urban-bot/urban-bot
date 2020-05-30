import { UrbanBotType, UrbanEventListener } from '../types';
import { useSubscribeWithSpreadPayload } from './hooks';

type Pattern = string | RegExp;

export function useText<BotType extends UrbanBotType>(
    listener: UrbanEventListener<BotType, 'text'>,
    pattern?: Pattern | Pattern[],
) {
    const listenerGuard: UrbanEventListener<BotType, 'text'> = (event) => {
        if (pattern !== undefined) {
            const patterns = Array.isArray(pattern) ? pattern : [pattern];

            const isTextMatchPatterns = patterns.some((pattern) => {
                if (pattern instanceof RegExp) {
                    return pattern.test(event.text);
                }

                return pattern === event.text;
            });

            if (!isTextMatchPatterns) {
                return;
            }
        }

        listener(event);
    };

    useSubscribeWithSpreadPayload(listenerGuard, 'text');
}
