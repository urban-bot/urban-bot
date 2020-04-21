import React from 'react';

type Markup = {};
type Link = Markup & { href: string };

declare module 'react' {
    namespace JSX {
        export interface IntrinsicElements {
            'urban-text': any;
            'urban-img': any;
            'urban-buttons': any;

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
