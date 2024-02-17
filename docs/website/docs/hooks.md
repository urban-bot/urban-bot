---
id: hooks
title: Hooks 
sidebar_label: Hooks
---
**Available react hooks. Use it to subscribe to user actions or get application data.**

<a href="https://github.com/urban-bot/base-example/blob/master/src/components/Hooks.tsx" target="_blank">**Examples**</a>

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
 * [useCommand](#usecommand)
 * [useFile](#usefile)
 * [useText](#usetext)
 * [useImage](#useimage)
 * [useAnimation](#useanimation)
 * [useVideo](#usevideo)
 * [useAudio](#useaudio)
 * [useVoice](#usevoice)
 * [useSticker](#usesticker)
 * [useLocation](#uselocation)
 * [useContact](#usecontact)
 * [usePoll](#usepoll)
 * [useInvoice](#useinvoice)
 * [useDice](#usedice)
 * [useAction](#useaction)
 * [useMediaGroup](#usemediagroup)
 
## Common
#### chat
> Information about the chat.

###### required
```typescript
type UrbanChat = {
    id: string;
    type?: string;
    title?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    description?: string;
    inviteLink?: string;
}
```
```jsx
function SomeComponent() {
    useText(({ chat }) => {
        console.log('message from chat id', chat.id);
    });

    // ...
}
```
#### from
> Information about who send the message.

###### required
```typescript
type UrbanFrom = {
    id?: string;
    isBot?: boolean;
    username?: string;
    firstName?: string;
    lastName?: string;
}
```
```jsx
function SomeComponent() {
    useAnyEvent(({ from }) => {
        console.log('message from user id', from.id);
    });

    // ...
}
```

#### nativeEvent
> Native event data from the specific messenger.

###### required
```typescript
type UrbanNativeEvent = {
    type: string; // 'TELEGRAM' | 'FACEBOOK' | ...
    payload?: any;
}
```
```jsx
// facebook bot
function SomeComponent() {
    useImage(({ nativeEvent }) => {
        const senderId = nativeEvent.payload.entry[0].messaging[0].sender.id;
       
        console.log(`Some data from native facebook event ${senderId}`);
    });

    // ...
}
```
If you use `typescript` to get the right type pass `UrbanBot*Type` as generic. 
```jsx
// ...
import { UrbanBotFacebookType } from '@urban-bot/facebook';

function SomeComponent() {
    useImage<UrbanBotFacebookType>(({ nativeEvent }) => {
        const senderId = nativeEvent?.payload?.entry[0].messaging[0].sender.id;
       
        console.log(`Some data from native facebook event ${senderId}`);
    });

    // ...
}
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
> The file type of media content from user messages. It is used with useImage, useVideo, etc.
```typescript
type File = {
    id?: string;
    url?: string;
    name?: string;
    size?: number;
    width?: number;
    height?: number;
    mimeType?: string;
    type?: string;
    duration?: number;
}
```
## useBotContext
The main urban bot context. Your component has to be under [`Root`](components.md#root).
```jsx
function SomeComponent() {
    const context = useBotContext();

    // ...
}
```
#### [chat](#chat)
```jsx
function DisplayChatId() {
    const { chat } = useBotContext();

    return <Text>{chat.id}</Text>;
}
```
#### [bot](components.md#bot)
> An instance of specific UrbanBot.

[`UrbanBotTelegram`](telegram.md) | [`UrbanBotDiscord`](discord.md) | [`UrbanBotFacebook`](facebook.md) | [`UrbanBotSlack`](slack.md)

###### required
```jsx
function SomeComponent() {
    const { bot: telegramBot } = useBotContext();

    telegramBot.client.kickChatMember(/* ... */);

    // ...
}
```
If you use `typescript` to get the right type pass `UrbanBot*` as generic. 
```typescript
// ...
import { UrbanBotTelegram } from '@urban-bot/telegram';

function SomeComponent() {
    const { bot: telegramBot } = useBotContext<UrbanBotTelegram>();
 
    // client will be with all methods types
    telegramBot.client.kickChatMember(/* ... */);

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
        // telegram api
        bot.client.kickChatMember(/* ... */);
    }
    
    if (bot.type === UrbanBotSlack.type) {
        // slack api
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
You can pass [query](#query) as a second argument
```jsx
function SomeComponent() {
    const { navigate } = useRouter();

    return (
        <ButtonGroup>
            <Button onClick={() => navigate('/user', { id: 123 })}>Go to User</Button>
        </ButtonGroup>
    );
}
```
#### activePath
> Current route path.

###### required  
`string`
```jsx
 function WhereAmI() {
     const { activePath } = useRouter();
 
     return <Text>You are here {activePath}</Text>;
 }
 ```
#### history
> History of navigated paths. Maximum of saved paths you can change by [historyLength](components.md#historylength).

###### required
`string[]`
```jsx
 function WhereIHaveBeen() {
     const { history } = useRouter(); // => ['/profile', '/bucket', '/order']
 
     return <Text>You have been in {history.join(' ')}</Text>;
 }
 ```
#### params
> If a component is under a dynamic path like '/some-path/:id' you can get a variable using params.
###### optional  
`{ key: string }`
```jsx
function ComponentWithParams() {
    const { params } = useRouter();

    return <Text>Route id is {params.id}</Text>;
}
 ```
If you use `typescript` you can pass a type .
```jsx
function ComponentWithParams() {
    const { params } = useRouter<{ id: string }>();

    return <Text>Route id is {params.id}</Text>;
}
 ```
#### query
> You can navigate to another route with some additional information `navigate('/user', {id: 123})` and can get a variable using query.
###### optional
`{ key: any }`
```jsx
function ComponentWithQuery() {
    const { query } = useRouter();

    return <Text>Route id is {query.id}</Text>;
}
 ```
If you use `typescript` you can pass a type .
```jsx
function ComponentWithQuery() {
    const { query } = useRouter<{}, { id: number }>();

    return <Text>Route id is {query.id}</Text>;
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
`'text'` | `'command'` | `'sticker'` | `'animation'` | `'audio'` | `'contact'` | `'file'` | `'invoice'` | `'location'` | `'image'` | `'poll'` | `'dice'` | `'voice'` | `'action'` | `'video'`
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
You can subscribe to a specific text.

`string` | `RexExp` 
```jsx
function SomeComponent() {
    useText((event) => {
        console.log('user sent "hello"');
    }, 'hello');

    // ...
}
```
Or subscribe to several values.

(`string` | `RexExp`)[]
```jsx
function SomeComponent() {
    useText((event) => {
        console.log('user greeted');
    }, ['hi', /hello/]);

    // ...
}
```
#### text
> A text which a user sent.
###### required  
`string`
```jsx
function SomeComponent() {
    const [answer, setAnswer] = React.useState('Welcome to Urban Bot!');

    useText(({ text }) => {
        if (text === 'hello') {
            setAnswer('How can I help you?');
        }

        if (text === 'good buy') {
            setAnswer('See you soon');
        }
    });

    return <Text>{answer}</Text>;
}
```

#### [chat](#chat)
#### [from](#from)
#### [nativeEvent](#nativeevent)

## useCommand
`/command`

Call after a user sends a command. A command usually is a text with a prefix slash.
```jsx
function SomeComponent() {
    useCommand((event) => {
        console.log('user sent a command');
    });

    // ...
}
```
You can subscribe to a specific command.

`string` | `RexExp` 
```jsx
function SomeComponent() {
    const [name, setName] = React.useState();

    useCommand((event) => {
        setName(event.argument)
    }, '/setName');

    // ...
}
```
Or subscribe to several values.

(`string` | `RexExp`)[]
```jsx
function SomeComponent() {
    useCommand((event) => {
        console.log('user wants to set name');
    }, ['/setFirstName', '/setLastName']);

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
        console.log(`user sent a command ${command}`);
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
    useImage(({
        messageId, // => string
        fileId, // => string | undefined
        text, // => string | undefined
        files, // => UrbanFile[]
    }) => {
        const { id } = files[0];
    
        console.log('user sent a image with id', fileId || id);
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
    useVideo(({
        messageId, // => string
        fileId, // => string | undefined
        text, // => string | undefined
        files, // => UrbanFile[]
    }) => {
        const { id } = files[0];
    
        console.log('user sent a video with id', fileId || id);
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
    useAudio(({
        messageId, // => string
        fileId, // => string | undefined
        text, // => string | undefined
        files, // => UrbanFile[]
    }) => {
        const { id } = files[0];
    
        console.log('user sent an audio with id', fileId || id);
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
    useFile(({
        messageId, // => string
        fileId, // => string | undefined
        text, // => string | undefined
        files, // => UrbanFile[]
    }) => {
        const { id } = files[0];
      
        console.log('user sent a file with id', fileId || id);
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
> A voice duration.
###### optional
`number`
#### mimeType
> A voice mimeType.
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

## usePoll
Call after a user sends a poll.
```jsx
function SomeComponent() {
    usePoll((event) => {
        console.log('user sent a poll');
    });

    // ...
}
```
#### question
> A poll question.
###### required
`string`
```jsx
function SomeComponent() {
    usePoll(({ question }) => {
        console.log(`user ask a question ${question}`);
    });

    // ...
}
```
#### options
> A poll options.
###### required
[`option`](#option)[]
```jsx
function SomeComponent() {
    usePoll(({ options }) => {
        options.forEach((option) => {
            console.log(`you can choose ${option.text}`);
        });
    });

    // ...
}
```
#### id
> A poll id.
###### optional
`string` | `number`
#### [chat](#chat)
#### [from](#from)
#### [nativeEvent](#nativeevent)

### Option
```typescript
text: string;
id?: string | number; 
count?: number;
```

## useInvoice
Call after a user sends an invoice.
```jsx
function SomeComponent() {
    useInvoice((event) => {
        console.log('user sent an invoice');
    });

    // ...
}
```

#### totalAmount
> An invoice totalAmount.
###### required
`number`
```jsx
function Billing() {
    useInvoice(({ totalAmount }) => {
        console.log(`user sent an invoice with ${totalAmount}`);
    });

    // ...
}
```
#### title
> An invoice title.
###### optional
`string`
#### description
> An invoice description.
###### optional
`string`
#### startParameter
> An invoice startParameter.
###### optional
`string`
#### currency
> An invoice currency.
###### optional
`string`

#### [chat](#chat)
#### [from](#from)
#### [nativeEvent](#nativeevent)

## useDice
Call after a user sends a random value.
```jsx
function SomeComponent() {
    useDice((event) => {
        console.log('user sent an random value');
    });

    // ...
}
```
#### value
> A random value.
###### required
`number`
```jsx
function SomeComponent() {
    useDice(({ value }) => {
        console.log(`user sent a random value ${value}`);
    });

    // ...
}
```
#### [chat](#chat)
#### [from](#from)
#### [nativeEvent](#nativeevent)

## useAction
Call after a user makes some action, for example, click a button.
```jsx
function SomeComponent() {
    useAction((event) => {
        console.log('user made some action');
    });

    // ...
}
```
#### actionId
> An action id.
###### required
`string`
```jsx
function SomeComponent() {
    useAction(({ actionId }) => {
        console.log(`user made action ${actionId}`);
    });

    // ...
}
```
#### [chat](#chat)
#### [from](#from)
#### [nativeEvent](#nativeevent)

## useMediaGroup
Call after a user sends a media group of files: images, videos, audios, animations, documents
```jsx
function SomeComponent() {
  useMediaGroup((event) => {
        console.log('user sent a media group');
    });

    // ...
}
```
#### files
> Images, videos, audios, animations, documents which a user sent.
###### required
[`file`](#file)[]
```jsx
function SomeComponent() {
    useMediaGroup(({
        mediaGroupId, // => string
        text, // => string | undefined
        files, // => UrbanFile[]
    }) => {
        // image file
        const {
            id, // => string
            size, // => number | undefined
            width, // => number
            height, // => number
            type, // => 'image'
        } = files[number];
        
        // video file
        const {
            id, // => string
            duration, // => number
            size, // => number | undefined
            mimeType, // => string | undefined
            type, // => 'video'
        } = files[number];

        // audio file
        const {
            name, // => string
            id, // => string
            duration, // => number
            size, // => number | undefined
            mimeType, // => string | undefined
            type, // => 'audio'
        } = files[number];

        // animation file
        const {
          id, // => string
          duration, // => number
          name, // => string | undefined
          mimeType, // => string | undefined
          type, // => 'animation'
        } = files[number];

        // document file
        const {
          id, // => string
          name, // =>  string | undefined
          size, // => number | undefined
          mimeType, // => string | undefined
          type, // => 'file',
        } = files[number];
        
        console.log('user sent a media group with files');
    });

    // ...
}
```
#### [chat](#chat)
#### [from](#from)
#### [nativeEvent](#nativeevent)