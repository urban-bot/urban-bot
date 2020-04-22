// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { UrbanMessageTextData, UrbanMessageImageData, UrbanMessageButtonsData } from './types/Messages';
import { ManagerBot } from './ManagerBot/ManagerBot';
import { UrbanChat } from './types';

export type Markup = { children: React.ReactNode };
export type Link = Markup & { href: string };
export type UrbanElement<Type = unknown, NativeEventPayload = unknown, Meta = unknown> = {
    $$managerBot: ManagerBot<Type, NativeEventPayload, Meta>;
    chat: UrbanChat;
    isNewMessageEveryRender?: boolean;
};

export type UrbanElementText = UrbanElement & UrbanMessageTextData;
export type UrbanElementImage = UrbanElement & UrbanMessageImageData;
export type UrbanElementButtons = UrbanElement & UrbanMessageButtonsData;

declare module 'react' {
    namespace JSX {
        // copy from @types/react
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface Element extends React.ReactElement<any, any> {}
        interface ElementClass extends React.Component<any> {
            render(): React.ReactNode;
        }
        interface ElementAttributesProperty {
            props: {};
        }
        interface ElementChildrenAttribute {
            children: {};
        }

        // We can't recurse forever because `type` can't be self-referential;
        // let's assume it's reasonable to do a single React.lazy() around a single React.memo() / vice-versa
        type LibraryManagedAttributes<C, P> = C extends
            | React.MemoExoticComponent<infer T>
            | React.LazyExoticComponent<infer T>
            ? T extends React.MemoExoticComponent<infer U> | React.LazyExoticComponent<infer U>
                ? ReactManagedAttributes<U, P>
                : ReactManagedAttributes<T, P>
            : ReactManagedAttributes<C, P>;

        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface IntrinsicAttributes extends React.Attributes {}
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> {}

        // urban-bot overriding
        export interface IntrinsicElements {
            'urban-text': UrbanElementText;
            'urban-img': UrbanElementImage;
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
