/* eslint-disable @typescript-eslint/camelcase */
// const a = {
//     object: 'page',
//     entry: [
//         {
//             id: '101620374895957',
//             time: 1589549669895,
//             messaging: [
//                 {
//                     sender: { id: '2788977971213143' },
//                     recipient: { id: '101620374895957' },
//                     timestamp: 1589549669690,
//                     message: {
//                         mid: 'm_1lekE0hrhjMkBphfvFInee18whnUqYz0XnFxIsQbSUeZ0cQ2_r6Gv0zPxrZVfyxZKpBGojCLPWaMeGhTRbq7KQ',
//                         text: '123',
//                         nlp: {
//                             entities: {
//                                 sentiment: [{ confidence: 0.77291458845139, value: 'neutral' }],
//                                 location: [
//                                     { suggested: true, confidence: 0.34195482888008, value: '123', type: 'value' },
//                                 ],
//                             },
//                             detected_locales: [],
//                         },
//                     },
//                 },
//             ],
//         },
//     ],
// };

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

export type FacebookMessageMeta = {
    sender: { id: string };
    recipient: { id: string };
    timestamp: number;
    message: FacebookMessage;
};

export type FacebookEntry = {
    id: string;
    time: number;
    messaging: FacebookMessageMeta[];
};

export type FacebookEventType = 'page' | string;

export type FacebookPayload = {
    object: FacebookEventType;
    entry: FacebookEntry[];
};
