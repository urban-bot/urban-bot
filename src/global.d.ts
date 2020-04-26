import React from 'react';
import {
    UrbanMessageTextData,
    UrbanMessageImageData,
    UrbanMessageButtonsData,
    UrbanMessageAudioData,
} from './types/Messages';
import { ManagerBot } from './ManagerBot/ManagerBot';
import { UrbanChat } from './types';
import { UrbanNativeEvent } from './types/Events';

export type Markup = { children: React.ReactNode };
export type Link = Markup & { href: string };
export type UrbanElement<NativeEvent extends UrbanNativeEvent, MessageMeta = unknown> = {
    $$managerBot: ManagerBot<NativeEvent, MessageMeta>;
    chat: UrbanChat;
    isNewMessageEveryRender?: boolean;
};

export type UrbanElementText = UrbanElement & { data: UrbanMessageTextData };
export type UrbanElementImage = UrbanElement & { data: UrbanMessageImageData };
export type UrbanElementAudio = UrbanElement & { data: UrbanMessageAudioData };
export type UrbanElementButtons = UrbanElement & { data: UrbanMessageButtonsData };

declare global {
    namespace JSX {
        export interface IntrinsicElements {
            'urban-text': UrbanElementText;
            'urban-img': UrbanElementImage;
            'urban-audio': UrbanElementAudio;
            'urban-buttons': UrbanElementButtons;
            b: Markup;
            i: Markup;
            u: Markup;
            s: Markup;
            code: Markup;
            pre: Markup;
            q: Markup;
            a: Link;
            br: {};
        }
    }
}
