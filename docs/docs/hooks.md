---
id: hooks
title: Hooks 
sidebar_label: Hooks
---
**Available react hooks. Use it to subscrube to user actions or get an application data.**

All variables you can import from `@urban-bot/core`.  
```javascript
import { useBotContext, useText } from '@urban-bot/core';  
```
```javascript
const { useBotContext, useText } = require('@urban-bot/core');  
```  

## Navigation
 * [Common](#common)
 * [useBotContext](#usebotcontext)
 * [useRouter](#userouter)
 * [useAnyEvent](#useanyevent)
 * [useText](#usetext)
 * [useCommand](#usecommand)
 * [useImage](#useimage)
 * [useVideo](#usevideo)
 * [useAudio](#useaudio)
 * [useFile](#usefile)
 * [useAnimation](#useanimation)
 * [useVoice](#usevoice)
 * [useSticker](#usesticker)
 * [useLocation](#uselocation)
 * [useContact](#usecontact)
 
## Common
#### chat
> Information about the chat.

###### required
```jsx
function SomeComponent() {
    useText(({ chat }) => {
        console.log('message from chat id', chat.id);
    });

    // ...
}
```
```typescript
id: string;
type?: string;
title?: string;
username?: string;
firstName?: string;
lastName?: string;
description?: string;
inviteLink?: string;
```
#### from
> Information about who send the message.

###### required
```jsx
function SomeComponent() {
    useAnyEvent(({ from }) => {
        console.log('message from user id', from.id);
    });

    // ...
}
```
```typescript
id?: string;
isBot?: boolean;
username?: string;
firstName?: string;
lastName?: string;
```

#### nativeEvent
> Native event data from the specific messenger.

###### required
```jsx
function SomeComponent() {
    useImage(({ nativeEvent }) => {
        console.log('this message from messenger', nativeEvent.type);
        // do stuff with nativeEvent.payload
    });

    // ...
}
```
```typescript
type: string; // 'TELEGRAM' || 'FACEBOOK' || ...
payload?: any;
```
If you develop some messengers you can divide behavior by comparing type.
```jsx
import { UrbanBotTelegram } from '@urban-bot/telegram';
import { UrbanBotFacebook } from '@urban-bot/facebook';

function SomeComponent() {
    useText(({ nativeEvent }) => {
        if (nativeEvent.type === UrbanBotTelegram.type) {
            console.log('this message from telegram');
        }
        
        if (nativeEvent.type === UrbanBotFacebook.type) {
            console.log('this message from facebook');
        }
    });

    // ...
}
```
#### file
> The file type of media content which is a user can send. Used with useImage, useVideo,... hooks.
```typescript
id?: string;
url?: string;
name?: string;
size?: number;
width?: number;
height?: number;
mimeType?: string;
type?: string;
duration?: number;
```
## useBotContext
The main urban bot context. It works under [`Root`](components.md#root).
```jsx
function SomeComponent() {
    const context = useBotContext();

    // ...
}
```
#### [chat](#chat)
###### required
```jsx
function DisplayChatId() {
    const { chat } = useBotContext();

    return <Text>{chat.id}</Text>;
}
```
#### [bot](components.md#bot)
> An instance of specific UrbanBot*.

###### required
```jsx
function SomeComponent() {
    const { bot: telegramBot } = useBotContext();

    telegramBot.bot.kickChatMember(/* ... */);

    // ...
}
```
If you develop some messengers you can divide behavior by comparing type.
```jsx
import { UrbanBotTelegram } from '@urban-bot/telegram';
import { UrbanBotSlack } from '@urban-bot/slack';

function SomeComponent() {
    const { bot } = useBotContext();
     
    if (bot.type === UrbanBotTelegram.type) {
        bot.bot.kickChatMember(/* ... */);
    }
    
    if (bot.type === UrbanBotSlack.type) {
        bot.client.conversations.kick(/* ... */);
    }


    // ...
}
```
#### [isNewMessageEveryRender](components.md#isnewmessageeveryrender)
> The value that is passed to the [`Root`](components.md#root).

###### optional
```jsx
function SomeComponent() {
    const { isNewMessageEveryRender } = useBotContext();

    // ...
}
```
#### [parseMode](components.md#parsemode)
> The value that is passed to the [`Root`](components.md#root).

###### optional
```jsx
function SomeComponent() {
    const { parseMode } = useBotContext();
    
    // ...
}
```
## useRouter
The router context. It works under [`Router`](components.md#router).
```jsx
function SomeComponent() {
    const routerContext = useRouter();

    // ...
}
```
#### navigate
> Go to the particular route.

###### required
`Function`
```jsx
function ProfileButtons() {
    const { navigate } = useRouter();

    return (
        <ButtonGroup>
            <Button onClick={() => navigate('catalog')}>Go to Catalog</Button>
        </ButtonGroup>
    );
}
```
#### activePath
> Current route path.

###### required  
`string` | `RexExp` 
```jsx
 function WhereAmI() {
     const { activePath } = useRouter();
 
     return <Text>You are here {activePath}</Text>;
 }
 ```
## useAnyEvent
Call after any user action.
```jsx
function SomeComponent() {
    useAnyEvent((event) => {
        console.log('user made something');
    });

    // ...
}
```
#### type
> Event type.

###### required  
`'command'` | `'pool'` | `'sticker'` | `'animation'` | `'audio'` | `'contact'` | `'file'` | `'invoice'` | `'location'` | `'image'` | `'poll'` | `'dice'` | `'voice'` | `'action'` | `'video'`
```jsx
function SomeComponent() {
    useAnyEvent(({ type }) => {
        console.log('event type', type);
    });

    // ...
}
```

#### payload
> Payload depending on the event type.

###### optional  
`any`
```jsx
function SomeComponent() {
    useAnyEvent(({ type, payload }) => {
        if (type === 'text') {
            console.log(payload.text);
        }

        if (type === 'location') {
            console.log(payload.latitude);
        }
    });

    // ...
}
```
#### [chat](#chat)
#### [from](#from)
#### [nativeEvent](#nativeevent)

## useText
Call after a user sends a text.
```jsx
function SomeComponent() {
    useText((event) => {
        console.log('user sent a text');
    });

    // ...
}
```
#### text
> A text which a user sent.
###### required  
`string`
```jsx
function SomeComponent() {
    useText(({ text }) => {
        // do stuff with a text
    });

    // ...
}
```

#### [chat](#chat)
#### [from](#from)
#### [nativeEvent](#nativeevent)

## useCommand
`/command`

Call after a user sends a command. Command usually is a text with prefix slash.
```jsx
function SomeComponent() {
    useCommand((event) => {
        console.log('user sent a command');
    });

    // ...
}
```
#### command
> A command which a user sent.
###### required  
`string`
```jsx
function SomeComponent() {
    useCommand(({ command }) => {
        // do stuff with a command
    });

    // ...
}
```
#### argument
> An additional text after a command. If a user writes `/sayMyName Heisenberg`, command is `/sayMyName`, argument is `Heisenberg`.

###### optional  
 `string`
```jsx
function SomeComponent() {
    useCommand(({ command, argument }) => {
        if (command === '/sayMyName') {
            console.log(argument);
        }
    });

    // ...
}
```
#### [chat](#chat)
#### [from](#from)
#### [nativeEvent](#nativeevent)

## useImage
Call after a user sends an image or images.
```jsx
function SomeComponent() {
    useImage((event) => {
        console.log('user sent an image');
    });

    // ...
}
```
#### files
> Images which a user sent.
###### required
[`file`](#file)[]
```jsx
function SomeComponent() {
    useImage(({ files }) => {
        const id = files[0].id;
    
        console.log('user sent a image with id', id);
    });

    // ...
}
```
#### [chat](#chat)
#### [from](#from)
#### [nativeEvent](#nativeevent)

## useVideo
Call after a user sends a video or videos.
```jsx
function SomeComponent() {
    useVideo((event) => {
        console.log('user sent a video');
    });

    // ...
}
```
#### files
> Videos which a user sent.
###### required
[`file`](#file)[]
```jsx
function SomeComponent() {
    useVideo(({ files }) => {
        const id = files[0].id;
    
        console.log('user sent a video with id', id);
    });

    // ...
}
```
#### [chat](#chat)
#### [from](#from)
#### [nativeEvent](#nativeevent)

## useAudio
Call after a user sends an audio or audios.
```jsx
function SomeComponent() {
    useAudio((event) => {
        console.log('user sent an audio');
    });

    // ...
}
```
#### files
> Audios which a user sent.
###### required
[`file`](#file)[]
```jsx
function SomeComponent() {
    useAudio(({ files }) => {
        const id = files[0].id;
    
        console.log('user sent an audio with id', id);
    });

    // ...
}
```
#### [chat](#chat)
#### [from](#from)
#### [nativeEvent](#nativeevent)

## useFile
Call after a user sends a file or files.
```jsx
function SomeComponent() {
    useFile((event) => {
        console.log('user sent a file');
    });

    // ...
}
```
#### files
> Files which a user sent.
###### required
[`file`](#file)[]
```jsx
function SomeComponent() {
    useFile(({ files }) => {
        const id = files[0].id;
    
        console.log('user sent a file with id', id);
    });

    // ...
}
```
#### [chat](#chat)
#### [from](#from)
#### [nativeEvent](#nativeevent)

## useAnimation
Call after a user sends an animation.
```jsx
function SomeComponent() {
    useAnimation((event) => {
        console.log('user sent an animation');
    });

    // ...
}
```
#### name
> An animation name.
###### optional
`string`
```jsx
function SomeComponent() {
    useAnimation(({ name }) => {
        console.log(`user sent an animation with name ${name}`);
    });

    // ...
}
```
#### duration
> An animation duration.
###### optional
`number`
#### id
> An animation id.
###### optional
`string`
#### mimeType
> An animation mimeType.
###### optional
`string`

#### [chat](#chat)
#### [from](#from)
#### [nativeEvent](#nativeevent)



## useVoice
Call after a user sends a voice.
```jsx
function SomeComponent() {
    useVoice((event) => {
        console.log('user sent a voice');
    });

    // ...
}
```
#### id
> A voice id.
###### optional
`string`
```jsx
function SomeComponent() {
    useVoice(({ id }) => {
        console.log(`user sent voice with id ${id}`);
    });

    // ...
}
```
#### duration
> A sticker duration.
###### optional
`number`
#### mimeType
> A sticker mimeType.
###### optional
`string`

#### [chat](#chat)
#### [from](#from)
#### [nativeEvent](#nativeevent)

## useSticker
Call after a user sends a sticker.
```jsx
function SomeComponent() {
    useSticker((event) => {
        console.log('user sent a sticker');
    });

    // ...
}
```
#### emoji
>  An emoji which is connected with a sticker.
###### optional
`string`
```jsx
function SomeComponent() {
    useSticker(({ emoji }) => {
        console.log(`user sent a sticker ${emoji}`);
    });

    // ...
}
```
#### name
> A sticker name.
###### optional
`string`
#### id
> A sticker id.
###### optional
`string`
#### width
> A sticker width.
###### optional
`number`
#### height
> A sticker height.
###### optional
`number`

#### [chat](#chat)
#### [from](#from)
#### [nativeEvent](#nativeevent)


## useLocation
Call after a user sends a location.
```jsx
function SomeComponent() {
    useLocation((event) => {
        console.log('user sent a location');
    });

    // ...
}
```
#### latitude
###### required
`number`
#### longitude
###### required
`number`
```jsx
function SomeComponent() {
    useLocation(({ latitude, longitude }) => {
        console.log(`user sent a coordinate ${latitude} ${longitude}`);
    });

    // ...
}
```
#### [chat](#chat)
#### [from](#from)
#### [nativeEvent](#nativeevent)

## useContact
Call after a user sends a contact.
```jsx
function SomeComponent() {
    useContact((event) => {
        console.log('user sent a contact');
    });

    // ...
}
```
#### phoneNumber
> A contact phoneNumber.
###### optional
`string`
```jsx
function SomeComponent() {
    useContact(({ phoneNumber }) => {
        console.log(`user sent a phone number ${phoneNumber}`);
    });

    // ...
}
```
#### firstName
> A contact firstName.
###### optional
`string`
#### lastName
> A contact lastName.
###### optional
`string`
#### userId
> A contact id.
###### optional
`string` | `number`
#### [chat](#chat)
#### [from](#from)
#### [nativeEvent](#nativeevent)
