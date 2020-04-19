import { KnownBlock } from '@slack/types';

export type Respond = (message: any) => Promise<unknown>;
export type SlackAction = {
    value: string;
};

export type SlackActionContext = {
    channel: {
        id: string;
    };
    actions: SlackAction[];
};

export type SlackMessageType = 'message';
export type SlackChanelType = 'channel' | 'im';

export type SlackMessageContext = {
    client_msg_id: string;
    type: SlackMessageType;
    team: string;
    blocks: KnownBlock[];
    event_ts: string;
    channel_type: SlackChanelType;
    bot_id?: string;
    subtype?: string;
    text: string;
    user: string;
    channel: string;
    ts: string;
};

export type SlackCommandContext = { channel_id: string; command: string; text: string };

export type SlackPayload = SlackActionContext | SlackMessageContext | SlackCommandContext;
