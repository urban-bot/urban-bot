import type { UrbanSyntheticEvent } from '../events';
import type { UrbanBotType } from './UrbanBotType';

export type ProcessUpdate<BotType extends UrbanBotType> = (event: UrbanSyntheticEvent<BotType>) => void;
