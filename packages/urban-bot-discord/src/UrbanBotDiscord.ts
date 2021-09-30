/* eslint-disable @typescript-eslint/camelcase */
import {
    UrbanBot,
    UrbanMessage,
    UrbanSyntheticEvent,
    UrbanParseMode,
    UrbanSyntheticEventCommon,
    UrbanSyntheticEventCommand,
    UrbanSyntheticEventText,
    UrbanSyntheticEventImage,
    UrbanSyntheticEventVideo,
    UrbanSyntheticEventAudio,
    UrbanSyntheticEventFile,
    UrbanSyntheticEventAction,
} from '@urban-bot/core';
import { BitFieldResolvable, Client, Intents, IntentsString, Message, TextChannel, Interaction } from 'discord.js';
import groupBy from 'lodash.groupby';
import { formatButtons } from './format';

export type DISCORD = 'DISCORD';

export type DiscordPayload = Message | Interaction;

export type DiscordMessageMeta = {};

export type UrbanNativeEventDiscord<Payload = DiscordPayload> = {
    type: DISCORD;
    payload?: Payload;
};

export type UrbanBotDiscordType<Payload = DiscordPayload> = {
    NativeEvent: UrbanNativeEventDiscord<Payload>;
    MessageMeta: DiscordMessageMeta;
};

export type DiscordOptions = {
    token: string;
    intents?: BitFieldResolvable<IntentsString, number>;
    commandPrefix?: string;
};

const defaultOptions = {
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    ],
    commandPrefix: '/',
};

// Message {
//     channelId: '888019692558622762',
//         guildId: '888019691560394773',
//         deleted: false,
//         id: '888750778653769788',
//         type: 'DEFAULT',
//         system: false,
//         content: 'ttt',
//         author: User {
//             id: '712376851695140906',
//             bot: false,
//             system: false,
//             flags: UserFlags { bitfield: 0 },
//             username: 'ledamint',
//             discriminator: '9720',
//             avatar: '18fda80644e03181c48df63893b8dfb8'
//     },
//     pinned: false,
//         tts: false,
//         nonce: '888750778330644480',
//         embeds: [],
//         components: [],
//         attachments: Collection(0) [Map] {},
//     stickers: Collection(0) [Map] {},
//     createdTimestamp: 1631965097822,
//         editedTimestamp: null,
//         reactions: ReactionManager { message: [Circular *1] },
//     mentions: MessageMentions {
//         everyone: false,
//             users: Collection(0) [Map] {},
//         roles: Collection(0) [Map] {},
//         _members: null,
//             _channels: null,
//             crosspostedChannels: Collection(0) [Map] {},
//         repliedUser: null
//     },
//     webhookId: null,
//         groupActivityApplication: null,
//         applicationId: null,
//         activity: null,
//         flags: MessageFlags { bitfield: 0 },
//     reference: null,
//         interaction: null
// }

// <ref *1> Message {
//     channelId: '888019836519723018',
//         guildId: null,
//         deleted: false,
//         id: '888796834389196834',
//         type: 'DEFAULT',
//         system: false,
//         content: '123',
//         author: ClientUser {
//         id: '888013835057913858',
//             bot: true,
//             system: false,
//             flags: UserFlags { bitfield: 0 },
//         username: 'Urban Bot',
//             discriminator: '2530',
//             avatar: '565a23737ac52af81dc5e4e313084abd',
//             verified: true,
//             mfaEnabled: false
//     },
//     pinned: false,
//         tts: false,
//         nonce: null,
//         embeds: [],
//         components: [],
//         attachments: Collection(0) [Map] {},
//     stickers: Collection(0) [Map] {},
//     createdTimestamp: 1631976078365,
//         editedTimestamp: null,
//         reactions: ReactionManager { message: [Circular *1] },
//     mentions: MessageMentions {
//         everyone: false,
//             users: Collection(0) [Map] {},
//         roles: Collection(0) [Map] {},
//         _members: null,
//             _channels: null,
//             crosspostedChannels: Collection(0) [Map] {},
//         repliedUser: null
//     },
//     webhookId: null,
//         groupActivityApplication: null,
//         applicationId: null,
//         activity: null,
//         flags: MessageFlags { bitfield: 0 },
//     reference: null,
//         interaction: null
// }

export class UrbanBotDiscord implements UrbanBot<UrbanBotDiscordType> {
    static TYPE: DISCORD = 'DISCORD';
    type: DISCORD = UrbanBotDiscord.TYPE;
    defaultParseMode: UrbanParseMode = 'markdown';
    commandPrefix: string;
    client: Client;

    constructor(public options: DiscordOptions) {
        if (!('token' in options)) {
            throw new Error(`Provide pageAccessToken to @urban-bot/discord options`);
        }

        this.commandPrefix = options.commandPrefix ?? defaultOptions.commandPrefix;

        this.client = new Client({
            intents: options.intents ?? defaultOptions.intents,
            partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
        });

        this.client.on('messageCreate', this.handleMessage);

        this.client.on('interactionCreate', this.handleInteraction);

        // this.client.on('interactionCreate', async (interaction) => {
        //     if (!interaction.isCommand()) return;
        //
        //     if (interaction.commandName === 'ping') {
        //         await interaction.reply('Pong!');
        //     }
        // });

        this.client.login(options.token);
    }

    // initializeServer(expressApp: express.Express) {
    // }

    processUpdate(_event: UrbanSyntheticEvent<UrbanBotDiscordType>) {
        throw new Error('this method must be overridden');
    }

    handleInteraction = (interaction: Interaction) => {
        const isPrivateChat = !interaction.guildId;

        if (interaction.isButton()) {
            const adaptedContext: UrbanSyntheticEventAction<UrbanBotDiscordType> = {
                type: 'action',
                chat: {
                    id: String(interaction.channelId),
                    // type: ctx.message.chat.type,
                    // title: ctx.message.chat.title,
                    ...(isPrivateChat ? { username: interaction.user.username } : undefined),
                    // firstName: ctx.message.chat.first_name,
                    // lastName: ctx.message.chat.last_name,
                    // description: ctx.message.chat.description,
                    // inviteLink: ctx.message.chat.invite_link,
                },
                from: {
                    id: String(interaction.user.id),
                    username: interaction.user.username,
                    // firstName: interaction.user.,
                    // lastName: ctx.from?.last_name,
                    ...(interaction.user.avatar ? { avatars: [interaction.user.avatar] } : undefined),
                },
                payload: {
                    actionId: interaction.customId,
                },
                nativeEvent: {
                    type: UrbanBotDiscord.TYPE,
                    payload: interaction,
                },
            };

            this.processUpdate(adaptedContext);

            return interaction.deferUpdate();
        }
    };

    handleMessage = (message: Message) => {
        const isPrivateChat = !message.guildId;
        const common: UrbanSyntheticEventCommon<UrbanBotDiscordType> = {
            chat: {
                id: String(message.channelId),
                // type: ctx.chat.type,
                // title: ctx.chat.title,
                ...(isPrivateChat ? { username: message.author.username } : undefined),
                // firstName: ctx.chat.first_name,
                // lastName: ctx.chat.last_name,
                // description: ctx.chat.description,
                // inviteLink: ctx.chat.invite_link,
            },
            from: {
                id: String(message.author.id),
                username: message.author.username,
                // firstName: message.author.na,
                // lastName: ctx.from?.last_name,
                isBot: message.author.bot,
            },
            nativeEvent: {
                type: UrbanBotDiscord.TYPE,
                payload: message,
            },
        };

        switch (message.type) {
            case 'DEFAULT': {
                if (message.author.bot) {
                    return;
                }

                if (message.attachments.size === 0) {
                    const adaptedContext: UrbanSyntheticEventText<UrbanBotDiscordType> = {
                        ...common,
                        type: 'text',
                        payload: {
                            text: message.content,
                        },
                    };

                    this.processUpdate(adaptedContext);

                    break;
                }

                const formattedAttachments = Array.from(message.attachments.values()).map(
                    ({ id, url, name, size, width, height, contentType, ...rest }) => {
                        return {
                            id,
                            url,
                            name: name ?? undefined,
                            size,
                            width: width ?? undefined,
                            height: height ?? undefined,
                            mimeType: contentType ?? undefined,
                            ...rest,
                        };
                    },
                );

                const groupedAttachments = groupBy(formattedAttachments, ({ mimeType }) => {
                    if (mimeType?.startsWith('image')) {
                        return 'images';
                    }
                    if (mimeType?.startsWith('video')) {
                        return 'videos';
                    }
                    if (mimeType?.startsWith('audio')) {
                        return 'audios';
                    }

                    return 'files';
                });

                const { images, videos, audios, files } = groupedAttachments;

                if (images && images.length > 0) {
                    const adaptedContext: UrbanSyntheticEventImage<UrbanBotDiscordType> = {
                        ...common,
                        type: 'image',
                        payload: {
                            text: message.content,
                            files: images,
                        },
                    };

                    this.processUpdate(adaptedContext);
                }

                if (videos && videos.length > 0) {
                    const adaptedContext: UrbanSyntheticEventVideo<UrbanBotDiscordType> = {
                        ...common,
                        type: 'video',
                        payload: {
                            text: message.content,
                            files: videos,
                        },
                    };

                    this.processUpdate(adaptedContext);
                }

                if (audios && audios.length > 0) {
                    const adaptedContext: UrbanSyntheticEventAudio<UrbanBotDiscordType> = {
                        ...common,
                        type: 'audio',
                        payload: {
                            text: message.content,
                            files: audios,
                        },
                    };

                    this.processUpdate(adaptedContext);
                }

                if (files && files.length > 0) {
                    const adaptedContext: UrbanSyntheticEventFile<UrbanBotDiscordType> = {
                        ...common,
                        type: 'file',
                        payload: {
                            text: message.content,
                            files,
                        },
                    };

                    this.processUpdate(adaptedContext);
                }

                break;
            }
            case 'APPLICATION_COMMAND': {
                const adaptedContext: UrbanSyntheticEventCommand<UrbanBotDiscordType> = {
                    ...common,
                    type: 'command',
                    payload: {
                        command: message.content,
                    },
                };

                this.processUpdate(adaptedContext);

                break;
            }
        }
    };

    async sendMessage(message: UrbanMessage): Promise<DiscordMessageMeta> {
        const channel = this.client.channels.cache.get(message.chat.id);

        if (!channel) {
            throw new Error('Channel is not found @urban-bot/discord');
        }

        switch (message.nodeName) {
            case 'urban-text': {
                return (channel as TextChannel).send({ content: message.data.text });
            }
            case 'urban-buttons': {
                return (channel as TextChannel).send({
                    ...(message.data.title ? { content: message.data.title } : undefined),
                    ...(message.data.buttons ? { components: formatButtons(message.data.buttons) } : undefined),
                });
            }
            case 'urban-img': {
                if (typeof message.data.file !== 'string') {
                    throw new Error('@urban-bot/discord support image file only as string');
                }

                return (channel as TextChannel).send({
                    ...(message.data.title ? { content: message.data.title } : undefined),
                    ...(message.data.buttons ? { components: formatButtons(message.data.buttons) } : undefined),
                    files: [message.data.file],
                });
            }
            case 'urban-audio': {
                if (typeof message.data.file !== 'string') {
                    throw new Error('@urban-bot/discord support audio file only as string');
                }

                return (channel as TextChannel).send({
                    ...(message.data.title ? { content: message.data.title } : undefined),
                    ...(message.data.buttons ? { components: formatButtons(message.data.buttons) } : undefined),
                    files: [message.data.file],
                });
            }
            case 'urban-video': {
                if (typeof message.data.file !== 'string') {
                    throw new Error('@urban-bot/discord support video file only as string');
                }

                return (channel as TextChannel).send({
                    ...(message.data.title ? { content: message.data.title } : undefined),
                    ...(message.data.buttons ? { components: formatButtons(message.data.buttons) } : undefined),
                    files: [message.data.file],
                });
            }
            case 'urban-file': {
                if (typeof message.data.file !== 'string') {
                    throw new Error('@urban-bot/discord support file file only as string');
                }

                return (channel as TextChannel).send({
                    ...(message.data.title ? { content: message.data.title } : undefined),
                    ...(message.data.buttons ? { components: formatButtons(message.data.buttons) } : undefined),
                    files: [message.data.file],
                });
            }
            case 'urban-media': {
                return (channel as TextChannel).send({
                    ...(message.data.title ? { content: message.data.title } : undefined),
                    ...(message.data.buttons ? { components: formatButtons(message.data.buttons) } : undefined),
                    files: message.data.files.map(({ file }) => {
                        if (typeof file !== 'string') {
                            throw new Error('@urban-bot/discord support media file only as string');
                        }

                        return file;
                    }),
                });
            }
            default: {
                throw new Error(
                    `Tag '${
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (message as any).nodeName
                    }' is not supported. Please don't use it with discord bot or add this logic to @urban-bot/discord.`,
                );
            }
        }
    }
}
