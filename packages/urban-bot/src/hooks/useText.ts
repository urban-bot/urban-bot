import { UrbanBotType, UrbanEventListener } from '../types';
import { useSubscribeWithSpreadPayload } from './hooks';
import { matchPattern } from '../utils/matchPattern';

export type Pattern = string | RegExp;

export function useText<BotType extends UrbanBotType>(
    listener: UrbanEventListener<BotType, 'text'>,
    pattern?: Pattern | Pattern[],
) {
    const listenerGuard: UrbanEventListener<BotType, 'text'> = (event) => {
        if (pattern !== undefined) {
            const isTextMatchPattern = matchPattern(event.text, pattern);

            if (!isTextMatchPattern) {
                return;
            }
        }

        listener(event);
    };

    useSubscribeWithSpreadPayload(listenerGuard, 'text');
}
