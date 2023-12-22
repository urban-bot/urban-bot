import { matchPattern } from '../utils/matchPattern';
import { useSubscribeWithSpreadPayload } from './useSubscribeWithSpreadPayload';
import type { UrbanBotType, UrbanEventListener } from '../types';

export type Pattern = string | RegExp;

export function useText<BotType extends UrbanBotType>(
    listener: UrbanEventListener<BotType, 'text'>,
    pattern?: Pattern | Pattern[],
) {
    const listenerGuard: UrbanEventListener<BotType, 'text'> = (event) => {
        if (pattern) {
            const isTextMatchPattern = matchPattern(event.text, pattern);

            if (!isTextMatchPattern) {
                return;
            }
        }

        listener(event);
    };

    useSubscribeWithSpreadPayload(listenerGuard, 'text');
}
