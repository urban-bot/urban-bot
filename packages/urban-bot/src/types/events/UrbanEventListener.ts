import type { UrbanBotType, UrbanListener } from '../bot';
import type { UrbanSyntheticEvent, UrbanSyntheticEventByType, UrbanSyntheticEventType } from './UrbanSyntheticEvent';

type SpreadField<T, K extends keyof T> = Omit<T, K> & T[K];

export type UrbanListenerByType<
    BotType extends UrbanBotType,
    T extends UrbanSyntheticEvent<BotType>['type']
> = UrbanListener<UrbanSyntheticEventByType<BotType, T>>;

export type UrbanListenerByNativeEvent<BotType extends UrbanBotType> = UrbanListenerByType<
    BotType,
    UrbanSyntheticEventType<BotType>
>;

export type UrbanListenerByNativeEventWithSpreadPayload<
    BotType extends UrbanBotType,
    Event extends Parameters<UrbanListenerByNativeEvent<BotType>>[0]
> = (event: SpreadField<Event, 'payload'>) => unknown;

export type UrbanEventListener<BotType extends UrbanBotType, Command extends UrbanSyntheticEvent<BotType>['type']> = (
    event: SpreadField<UrbanSyntheticEventByType<BotType, Command>, 'payload'>,
) => unknown;
