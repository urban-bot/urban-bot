import React from 'react';
import { ManagerBot } from './ManagerBot/ManagerBot';
import type {
    UrbanChat,
    UrbanMessageTextData,
    UrbanMessageImageData,
    UrbanMessageButtonsData,
    UrbanMessageAudioData,
    UrbanMessageVoiceData,
    UrbanMessageFileData,
    UrbanMessagePollData,
    UrbanMessageVideoData,
    UrbanMessageVideoNoteData,
    UrbanMessageAnimationData,
    UrbanMessageContactData,
    UrbanMessageMediaData,
    UrbanMessageLocationData,
    UrbanNativeEvent,
} from './types';

export type Markup = { children: React.ReactNode };
export type ChatElement = { children: React.ReactNode; key?: string };
export type Link = Markup & { href: string };
export type UrbanElement<NativeEvent extends UrbanNativeEvent = any, MessageMeta = any> = {
    $$managerBot: ManagerBot<NativeEvent, MessageMeta>;
    chat: UrbanChat;
    isNewMessageEveryRender?: boolean;
};

export type UrbanElementText = UrbanElement & { data: UrbanMessageTextData };
export type UrbanElementImage = UrbanElement & { data: UrbanMessageImageData };
export type UrbanElementAudio = UrbanElement & { data: UrbanMessageAudioData };
export type UrbanElementVoice = UrbanElement & { data: UrbanMessageVoiceData };
export type UrbanElementVideo = UrbanElement & { data: UrbanMessageVideoData };
export type UrbanElementVideoNote = UrbanElement & { data: UrbanMessageVideoNoteData };
export type UrbanElementButtons = UrbanElement & { data: UrbanMessageButtonsData };
export type UrbanElementFile = UrbanElement & { data: UrbanMessageFileData };
export type UrbanElementPoll = UrbanElement & { data: UrbanMessagePollData };
export type UrbanElementAnimation = UrbanElement & { data: UrbanMessageAnimationData };
export type UrbanElementContact = UrbanElement & { data: UrbanMessageContactData };
export type UrbanElementMedia = UrbanElement & { data: UrbanMessageMediaData };
export type UrbanElementLocation = UrbanElement & { data: UrbanMessageLocationData };

declare global {
    namespace JSX {
        export interface IntrinsicElements {
            'urban-text': UrbanElementText;
            'urban-img': UrbanElementImage;
            'urban-audio': UrbanElementAudio;
            'urban-voice': UrbanElementVoice;
            'urban-buttons': UrbanElementButtons;
            'urban-video': UrbanElementVideo;
            'urban-video-note': UrbanElementVideoNote;
            'urban-file': UrbanElementFile;
            'urban-poll': UrbanElementPoll;
            'urban-animation': UrbanElementAnimation;
            'urban-contact': UrbanElementContact;
            'urban-media': UrbanElementMedia;
            'urban-location': UrbanElementLocation;
            chat: ChatElement;
            b: Markup;
            strong: Markup;
            i: Markup;
            em: Markup;
            u: Markup;
            ins: Markup;
            s: Markup;
            strike: Markup;
            del: Markup;
            code: Markup;
            pre: Markup;
            q: Markup;
            a: Link;
            br: {};
        }
    }
}
