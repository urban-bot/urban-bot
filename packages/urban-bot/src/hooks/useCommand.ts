import { UrbanBotType, UrbanEventListener } from '../types';
import { useSubscribeWithSpreadPayload } from './hooks';
import { matchPattern } from '../utils/matchPattern';

export type Pattern = string | RegExp;

export function useCommand<BotType extends UrbanBotType>(
    listener: UrbanEventListener<BotType, 'command'>,
    pattern?: Pattern | Pattern[],
) {
    const listenerGuard: UrbanEventListener<BotType, 'command'> = (event) => {
        if (pattern !== undefined) {
            const isTextMatchPattern = matchPattern(event.command, pattern);

            if (!isTextMatchPattern) {
                return;
            }
        }

        listener(event);
    };

    useSubscribeWithSpreadPayload(listenerGuard, 'command');
}
