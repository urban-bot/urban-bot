// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { UrbanMessageTextData, UrbanMessageImageData, UrbanMessageButtonsData } from './types/Messages';
import { ManagerBot } from './ManagerBot/ManagerBot';
import { UrbanChat } from './types';

export type Markup = {};
export type Link = Markup & { href: string };
export type UrbanElement = {
    $$managerBot: ManagerBot;
    chat: UrbanChat;
    isNewMessageEveryRender?: boolean;
};

declare module 'react' {
    namespace JSX {
        export interface IntrinsicElements {
            'urban-text': UrbanElement & UrbanMessageTextData;
            'urban-img': UrbanElement & UrbanMessageImageData;
            'urban-buttons': UrbanElement & UrbanMessageButtonsData;
            b: Markup;
            i: Markup;
            u: Markup;
            s: Markup;
            code: Markup;
            pre: Markup;
            q: Markup;
            a: Link;
            br: Markup;
        }
    }
}
