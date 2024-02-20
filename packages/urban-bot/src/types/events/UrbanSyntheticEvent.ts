import type { UrbanBotType } from '../bot';
import * as T from './UrbanSyntheticEvents';

export type UrbanSyntheticEvent<BotType extends UrbanBotType> =
    | T.UrbanSyntheticEventAction<BotType>
    | T.UrbanSyntheticEventVoice<BotType>
    | T.UrbanSyntheticEventCommand<BotType>
    | T.UrbanSyntheticEventInvoice<BotType>
    | T.UrbanSyntheticEventAnimation<BotType>
    | T.UrbanSyntheticEventAudio<BotType>
    | T.UrbanSyntheticEventVideo<BotType>
    | T.UrbanSyntheticEventText<BotType>
    | T.UrbanSyntheticEventPoll<BotType>
    | T.UrbanSyntheticEventImage<BotType>
    | T.UrbanSyntheticEventFile<BotType>
    | T.UrbanSyntheticEventContact<BotType>
    | T.UrbanSyntheticEventSticker<BotType>
    | T.UrbanSyntheticEventLocation<BotType>
    | T.UrbanSyntheticEventDice<BotType>
    | T.UrbanSyntheticEventMediaGroup<BotType>
    | T.UrbanSyntheticEventAny<BotType>
    | T.UrbanSyntheticEventVideoNote<BotType>;

export type UrbanSyntheticEventByType<
    BotType extends UrbanBotType,
    T extends UrbanSyntheticEvent<BotType>['type']
> = T extends 'text'
    ? T.UrbanSyntheticEventText<BotType>
    : T extends 'command'
    ? T.UrbanSyntheticEventCommand<BotType>
    : T extends 'sticker'
    ? T.UrbanSyntheticEventSticker<BotType>
    : T extends 'animation'
    ? T.UrbanSyntheticEventAnimation<BotType>
    : T extends 'audio'
    ? T.UrbanSyntheticEventAudio<BotType>
    : T extends 'contact'
    ? T.UrbanSyntheticEventContact<BotType>
    : T extends 'file'
    ? T.UrbanSyntheticEventFile<BotType>
    : T extends 'invoice'
    ? T.UrbanSyntheticEventInvoice<BotType>
    : T extends 'location'
    ? T.UrbanSyntheticEventLocation<BotType>
    : T extends 'image'
    ? T.UrbanSyntheticEventImage<BotType>
    : T extends 'poll'
    ? T.UrbanSyntheticEventPoll<BotType>
    : T extends 'dice'
    ? T.UrbanSyntheticEventDice<BotType>
    : T extends 'voice'
    ? T.UrbanSyntheticEventVoice<BotType>
    : T extends 'action'
    ? T.UrbanSyntheticEventAction<BotType>
    : T extends 'video'
    ? T.UrbanSyntheticEventVideo<BotType>
    : T extends 'video_note'
    ? T.UrbanSyntheticEventVideoNote<BotType>
    : T extends 'media_group'
    ? T.UrbanSyntheticEventMediaGroup<BotType>
    : T extends 'any'
    ? T.UrbanSyntheticEventAny<BotType>
    : UrbanSyntheticEvent<BotType>;

export type UrbanSyntheticEventType<BotType extends UrbanBotType> = UrbanSyntheticEvent<BotType>['type'];
