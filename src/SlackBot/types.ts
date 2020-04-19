import {
    Button,
    ChannelsSelect,
    Checkboxes,
    ConversationsSelect,
    Datepicker,
    ExternalSelect,
    KnownBlock,
    MultiChannelsSelect,
    MultiConversationsSelect,
    MultiExternalSelect,
    MultiStaticSelect,
    MultiUsersSelect,
    Overflow,
    PlainTextInput,
    RadioButtons,
    StaticSelect,
    UsersSelect,
} from '@slack/types';

export type Respond = (message: any) => Promise<unknown>;

export type SlackUser = {
    id: string;
    username: string;
    name: string;
    team_id: string;
    api_app_id: string;
    token: string;
};

export type SlackContainer = {
    type: SlackMessageType;
    message_ts: string;
    channel_id: string;
    is_ephemeral: boolean;
};

export type SlackTeam = {
    id: string;
    domain: string;
};

export type SlackActionMessage = {
    type: SlackMessageType;
    text: string;
    user: string;
    ts: string;
    team: string;
    blocks?: KnownBlock[];
};

export type SlackAction =
    | UsersSelect
    | MultiUsersSelect
    | StaticSelect
    | MultiStaticSelect
    | ConversationsSelect
    | MultiConversationsSelect
    | ChannelsSelect
    | MultiChannelsSelect
    | ExternalSelect
    | MultiExternalSelect
    | Button
    | Overflow
    | Datepicker
    | RadioButtons
    | Checkboxes
    | PlainTextInput;

export type SlackActionType = SlackAction['type'];

export type SlackActionWithMeta = SlackAction & {
    action_id: string;
    block_id?: string;
    action_ts: string;
};

export type SlackActionContext = {
    type: string;
    channel: {
        id: string;
        name: string;
    };
    user: SlackUser;
    actions: SlackActionWithMeta[];
    container: SlackContainer;
    trigger_id: string;
    team: SlackTeam;
    message: SlackActionMessage;
    response_url: string;
};

export type SlackMessageType = 'message';
export type SlackChanelType = 'channel' | 'im';

export type SlackMessageContext = {
    client_msg_id: string;
    type: SlackMessageType;
    team: string;
    event_ts: string;
    channel_type: SlackChanelType;
    text: string;
    user: string;
    channel: string;
    ts: string;
    bot_id?: string;
    subtype?: string;
    blocks?: KnownBlock[];
};

export type SlackCommandContext = { channel_id: string; command: string; text: string };

export type SlackPayload = SlackActionContext | SlackMessageContext | SlackCommandContext;
