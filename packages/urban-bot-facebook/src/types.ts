export type FacebookNLPEntity = {
    confidence: number;
    suggested?: boolean;
    value: string;
};

export type FacebookNLP = {
    entities: {
        sentiment?: FacebookNLPEntity;
        greetings?: FacebookNLPEntity;
        thanks?: FacebookNLPEntity;
        bye?: FacebookNLPEntity;
        datetime?: FacebookNLPEntity;
        amount_of_money?: FacebookNLPEntity;
        phone_number?: FacebookNLPEntity;
        email?: FacebookNLPEntity;
        distance?: FacebookNLPEntity;
        quantity?: FacebookNLPEntity;
        temperature?: FacebookNLPEntity;
        volume?: FacebookNLPEntity;
        location?: FacebookNLPEntity;
        duration?: FacebookNLPEntity;
    };
    detected_locales?: string[];
};

export type FacebookAttachment = {
    type: string;
    payload: {
        url?: string;
    };
};

export type FacebookMessage = {
    mid: string;
    text?: string;
    attachments?: FacebookAttachment[];
    nlp?: FacebookNLP;
};

export type FacebookPostback = {
    title: string;
    payload: string;
};

export type FacebookMessaging = {
    sender: { id: string };
    recipient: { id: string };
    timestamp: number;
    message?: FacebookMessage;
    postback?: FacebookPostback;
};

export type FacebookEntry = {
    id: string;
    time: number;
    messaging: FacebookMessaging[];
};

export type FacebookEventType = 'page' | string;

export type FacebookPayload = {
    object: FacebookEventType;
    entry: FacebookEntry[];
};

export type FacebookMessageMeta = {
    recipient_id: string;
    message_id: string;
};
