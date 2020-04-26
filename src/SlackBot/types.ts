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
import { WebAPICallResult } from '@slack/web-api';

export type SLACK = 'SLACK';

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
    files?: SlackFile[];
    bot_id?: string;
    subtype?: string;
    blocks?: KnownBlock[];
    upload?: boolean;
    display_as_bot?: boolean;
};

export type SlackCommandContext = {
    user_name: string;
    user_id: string;
    token: string;
    channel_id: string;
    channel_name: string;
    command: string;
    text: string;
    team_id: string;
    team_domain: string;
    response_url?: string;
    trigger_id: string;
};

export type SlackPayload = SlackActionContext | SlackMessageContext | SlackCommandContext;

export type BotProfile = {
    id: string;
    deleted: boolean;
    name: string;
    app_id: string;
    updated: number;
    team_id: string;
};

export type SlackMessageMeta = WebAPICallResult & {
    channel: string;
    ts: string;
    message: {
        type: SlackMessageType;
        text: string;
        bot_id: string;
        user: string;
        ts: string;
        team: string;
    };
    response_metadata?: WebAPICallResult['response_metadata'] & {
        scopes?: SlackScope[];
        acceptedScopes?: SlackScope[];
    };
};

export type SlackScope =
    | 'admin'
    | 'admin.apps:read'
    | 'admin.apps:write'
    | 'admin.conversations:read'
    | 'admin.conversations:write'
    | 'admin.invites:read'
    | 'admin.invites:write'
    | 'admin.teams:read'
    | 'admin.teams:write'
    | 'admin.users:read'
    | 'admin.users:write'
    | 'app_mentions:read'
    | 'auditlogs:read'
    | 'bot'
    | 'channels:history'
    | 'channels:join'
    | 'channels:manage'
    | 'channels:read'
    | 'channels:write'
    | 'chat:write'
    | 'chat:write.customize'
    | 'chat:write.public'
    | 'chat:write:bot'
    | 'chat:write:user'
    | 'client'
    | 'commands'
    | 'conversations:history'
    | 'conversations:read'
    | 'conversations:write'
    | 'dnd:read'
    | 'dnd:write'
    | 'dnd:write:user'
    | 'emoji:read'
    | 'files:read'
    | 'files:write'
    | 'files:write:user'
    | 'groups:history'
    | 'groups:read'
    | 'groups:write'
    | 'identify'
    | 'identity.avatar'
    | 'identity.avatar:read:user'
    | 'identity.basic'
    | 'identity.email'
    | 'identity.email:read:user'
    | 'identity.team'
    | 'identity.team:read:user'
    | 'identity:read:user'
    | 'im:history'
    | 'im:read'
    | 'im:write'
    | 'incoming-webhook'
    | 'links:read'
    | 'links:write'
    | 'mpim:history'
    | 'mpim:read'
    | 'mpim:write'
    | 'none'
    | 'pins:read'
    | 'pins:write'
    | 'post'
    | 'reactions:read'
    | 'reactions:write'
    | 'read'
    | 'reminders:read'
    | 'reminders:read:user'
    | 'reminders:write'
    | 'reminders:write:user'
    | 'remote_files:read'
    | 'remote_files:share'
    | 'remote_files:write'
    | 'search:read'
    | 'stars:read'
    | 'stars:write'
    | 'team:read'
    | 'tokens.basic'
    | 'usergroups:read'
    | 'usergroups:write'
    | 'users.profile:read'
    | 'users.profile:write'
    | 'users.profile:write:user'
    | 'users:read'
    | 'users:read.email'
    | 'users:write';

export type SlackFile = {
    id: string;
    created: number;
    timestamp: number;
    name?: string;
    title?: string;
    mimetype: string;
    filetype?: string;
    pretty_type?: string;
    user?: string;
    editable?: boolean;
    size?: number;
    mode?: string;
    is_external?: boolean;
    external_type?: string;
    is_public?: boolean;
    public_url_shared?: boolean;
    display_as_bot?: boolean;
    username?: string;
    url_private?: string;
    url_private_download?: string;
    thumb_64?: string;
    thumb_80?: string;
    thumb_360?: string;
    thumb_360_w?: number;
    thumb_360_h?: number;
    thumb_160?: string;
    image_exif_rotation?: number;
    original_w?: number;
    original_h?: number;
    thumb_tiny?: string;
    edit_link?: string;
    preview?: string;
    preview_highlight?: string;
    lines?: number;
    lines_more?: number;
    preview_is_truncated?: boolean;
    thumb_video?: string;
    permalink?: string;
    permalink_public?: string;
    has_rich_preview?: boolean;
};
