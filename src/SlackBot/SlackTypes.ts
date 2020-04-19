type Respond = (message: any) => Promise<unknown>;
type SlackAction = {
    value: string;
};

type SlackActionContext = {
    channel: string;
    actions: SlackAction[];
};

type SlackMessageContext = {
    bot_id?: string;
    subtype?: string;

    text: string;
    user: string;
    channel: string;
    ts: string;
};

type Body = { channel_id: string; command: string; text: string };

type SlackPayloads = SlackActionContext | SlackMessageContext | Body;
