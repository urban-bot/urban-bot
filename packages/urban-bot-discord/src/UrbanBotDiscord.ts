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
    UrbanExistingMessage,
    UrbanCommand,
} from '@urban-bot/core';
import { Client, Message, TextChannel, Interaction, ClientOptions } from 'discord.js';
import groupBy from 'lodash.groupby';
import { formatButtons } from './format';
import { Routes } from 'discord-api-types/v9';
import { REST } from '@discordjs/rest';

export type DISCORD = 'DISCORD';

export type DiscordPayload = Message | Interaction;

export type DiscordMessageMeta = Message;

export type UrbanNativeEventDiscord<Payload = DiscordPayload> = {
    type: DISCORD;
    payload?: Payload;
};

export type UrbanBotDiscordType<Payload = DiscordPayload> = {
    NativeEvent: UrbanNativeEventDiscord<Payload>;
    MessageMeta: DiscordMessageMeta;
};

export type DiscordOptions = ClientOptions & {
    token: string;
    commandPrefix?: string;
    withDeletionInteractionCommand?: boolean;
    clientId?: string;
};

export class UrbanBotDiscord implements UrbanBot<UrbanBotDiscordType> {
    static TYPE: DISCORD = 'DISCORD';
    type: DISCORD = UrbanBotDiscord.TYPE;
    defaultParseMode: UrbanParseMode = 'markdown';
    client: Client;
    options: DiscordOptions;
    commandPrefix: string;

    constructor(options: DiscordOptions) {
        const { token, commandPrefix = '/', withDeletionInteractionCommand = true, ...discordOptions } = options;
        this.commandPrefix = commandPrefix;
        this.options = {
            token,
            withDeletionInteractionCommand,
            ...discordOptions,
        };

        if (!token) {
            throw new Error(`Provide pageAccessToken to @urban-bot/discord options`);
        }

        this.client = new Client(discordOptions);

        this.client.on('messageCreate', this.handleMessage);
        this.client.on('interactionCreate', this.handleInteraction);

        this.client.login(token);
    }

    // initializeServer(expressApp: express.Express) {
    // }

    processUpdate(_event: UrbanSyntheticEvent<UrbanBotDiscordType>) {
        throw new Error('this method must be overridden');
    }

    handleInteraction = async (interaction: Interaction) => {
        const isPrivateChat = !interaction.guildId;
        const common: UrbanSyntheticEventCommon<UrbanBotDiscordType> = {
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

            nativeEvent: {
                type: UrbanBotDiscord.TYPE,
                payload: interaction,
            },
        };

        if (interaction.isButton()) {
            const adaptedContext: UrbanSyntheticEventAction<UrbanBotDiscordType> = {
                ...common,
                type: 'action',
                payload: {
                    actionId: interaction.customId,
                },
            };

            this.processUpdate(adaptedContext);

            return interaction.deferUpdate();
        }

        if (interaction.isCommand()) {
            const adaptedContext: UrbanSyntheticEventCommand<UrbanBotDiscordType> = {
                ...common,
                type: 'command',
                payload: {
                    command: `${this.commandPrefix}${interaction.commandName}`,
                },
            };

            this.processUpdate(adaptedContext);

            if (this.options.withDeletionInteractionCommand) {
                await interaction.deferReply();
                return interaction.deleteReply();
            }
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
                    if (message.content[0] === this.commandPrefix) {
                        const [command, ...args] = message.content.split(' ');
                        const adaptedContext: UrbanSyntheticEventCommand<UrbanBotDiscordType> = {
                            ...common,
                            type: 'command',
                            payload: {
                                command,
                                argument: args.join(' '),
                            },
                        };

                        this.processUpdate(adaptedContext);

                        return;
                    }

                    const adaptedContext: UrbanSyntheticEventText<UrbanBotDiscordType> = {
                        ...common,
                        type: 'text',
                        payload: {
                            text: message.content,
                        },
                    };

                    this.processUpdate(adaptedContext);

                    return;
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

                return;
            }
        }
    };

    async sendMessage(message: UrbanMessage): Promise<DiscordMessageMeta> {
        const channel = this.client.channels.cache.get(message.chat.id);

        if (!channel) {
            throw new Error('Channel is not found @urban-bot/discord');
        }

        await this.simulateTyping(channel as TextChannel, message.data.simulateTyping);

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

    updateMessage(message: UrbanExistingMessage<UrbanBotDiscordType>) {
        switch (message.nodeName) {
            case 'urban-text': {
                return message.meta.edit(message.data.text);
            }
            case 'urban-buttons': {
                return message.meta.edit({
                    ...(message.data.title ? { content: message.data.title } : undefined),
                    ...(message.data.buttons ? { components: formatButtons(message.data.buttons) } : undefined),
                });
            }
            case 'urban-img': {
                return message.meta.edit({
                    ...(message.data.title ? { content: message.data.title } : undefined),
                    ...(message.data.buttons ? { components: formatButtons(message.data.buttons) } : undefined),
                    files: [message.data.file],
                });
            }
            case 'urban-video': {
                return message.meta.edit({
                    ...(message.data.title ? { content: message.data.title } : undefined),
                    ...(message.data.buttons ? { components: formatButtons(message.data.buttons) } : undefined),
                    files: [message.data.file],
                });
            }
            case 'urban-audio': {
                return message.meta.edit({
                    ...(message.data.title ? { content: message.data.title } : undefined),
                    ...(message.data.buttons ? { components: formatButtons(message.data.buttons) } : undefined),
                    files: [message.data.file],
                });
            }
            case 'urban-file': {
                return message.meta.edit({
                    ...(message.data.title ? { content: message.data.title } : undefined),
                    ...(message.data.buttons ? { components: formatButtons(message.data.buttons) } : undefined),
                    files: [message.data.file],
                });
            }
            case 'urban-media': {
                return message.meta.edit({
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
        }
    }

    deleteMessage(message: UrbanExistingMessage<UrbanBotDiscordType>) {
        return message.meta.delete();
    }

    async simulateTyping(channel: TextChannel, simulateTyping?: number) {
        if (typeof simulateTyping !== 'number') {
            return;
        }

        if (!channel.sendTyping) {
            console.error('sendTyping does not exist');
            return;
        }

        return new Promise((resolve) => {
            channel
                .sendTyping()
                .then(() => {
                    setTimeout(resolve, simulateTyping);
                })
                .catch((e) => {
                    console.error('Error with simulate typing');
                    console.error(e);
                    resolve();
                });
        });
    }

    async initializeCommands(commands: UrbanCommand[]) {
        const { clientId, token } = this.options;

        if (!clientId) {
            throw new Error('Provide clientId to UrbanBotDiscord to initialize commands');
        }

        const rest = new REST({ version: '9' }).setToken(token);

        try {
            const body = commands.map(({ command, description }) => ({ name: command.slice(1), description }));

            await rest.put(Routes.applicationCommands(clientId), {
                body,
            });
            console.log('Successfully initialized commands. They can start showing after an hour');
        } catch (error) {
            console.error('Error with initialize commands');
            console.error(error);
        }
    }
}
