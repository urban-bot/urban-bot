/* eslint-disable @typescript-eslint/camelcase */
import {
    UrbanBot,
    UrbanMessage,
    UrbanSyntheticEvent,
    UrbanParseMode,
    UrbanSyntheticEventCommon,
    UrbanSyntheticEventCommand,
    UrbanSyntheticEventText,
    // UrbanSyntheticEventType,
    // UrbanSyntheticEventCommon,
} from '@urban-bot/core';
import { BitFieldResolvable, Channel, Client, Intents, IntentsString, Message, TextChannel } from 'discord.js';

export type DISCORD = 'DISCORD';

export type DiscordPayload = Message;

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

const defaultOptions: Partial<DiscordOptions> = {
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

        this.client.on('ready', () => {
            console.log(`Logged in!`);
        });

        this.client.on('messageCreate', this.handleMessage);

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

    handleMessage = (message: Message) => {
        console.log(message.content)
        if (message.author.bot) {
            return;
        }

        const common: UrbanSyntheticEventCommon<UrbanBotDiscordType> = {
            chat: {
                id: String(message.channelId),
                // type: ctx.chat.type,
                // title: ctx.chat.title,
                // username: message,
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
            case 'APPLICATION_COMMAND': {
                const adaptedContext: UrbanSyntheticEventCommand<UrbanBotDiscordType> = {
                    ...common,
                    type: 'command',
                    payload: {
                        command: message.content,
                        // argument: args.join(' '),
                    },
                };

                this.processUpdate(adaptedContext);

                break;
            }
        }
    };

    async sendMessage(message: UrbanMessage): Promise<DiscordMessageMeta> {
        switch (message.nodeName) {
            case 'urban-text': {
                // console.log(8888, message.data.text);
                const channel = this.client.channels.cache.get(message.chat.id);

                if (!channel) {
                    throw new Error('Channel is not found @urban-bot/discord');
                }

                return (channel as TextChannel).send({ content: message.data.text });
            }
            // case 'urban-buttons': {
            // }
            // case 'urban-img': {
            // }
            // case 'urban-audio': {
            // }
            // case 'urban-video': {
            // }
            // case 'urban-file': {
            // }
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
