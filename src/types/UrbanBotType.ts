import { UrbanEvent } from './Events';

export type ProcessUpdate<Type, NativeEventPayload> = (event: UrbanEvent<Type, NativeEventPayload>) => void;

export interface UrbanBot<Type, NativeEventPayload> {
    processUpdate: ProcessUpdate<Type, NativeEventPayload>;
    initializeProcessUpdate: (processUpdate: ProcessUpdate<Type, NativeEventPayload>) => void;
}
