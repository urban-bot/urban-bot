export type UrbanChat = {
    id: string;
};

export type UrbanFrom = {
    id?: string | number;
    username?: string;
    firstName?: string;
    surname?: string;
};

export type UrbanParseMode = 'HTML' | 'markdown';

export type UrbanListener<Event> = (event: Event) => unknown;
