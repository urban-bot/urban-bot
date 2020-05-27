---
id: components
title: Components 
sidebar_label: Components
---
  
 * [render](#render)
 * [Common props](#common-props)
 * [Root](#root)  
 * [Router](#router)  
 * [Route](#route)  
 * [Text](#text)  
 * [ButtonGroup](#buttongroup)  
 * [Button](#button)  
 * [Image](#image)
 * [Video](#video)
 * [Audio](#audio)
 * [Animation](#animation)
 * [File](#file-4)
 * [Media](#media)
 * [Location](#location)
 * [Poll](#poll)
 * [Option](#option)
 * [Contact](#contact)
    
  
All variables you can import from `@urban-bot/core`.  
```jsx
import { render, Root, Text } from '@urban-bot/core';  
```
```jsx
const { render, Root, Text } = require('@urban-bot/core');  
```  
## render  
The main function that starts React. Works similar `ReactDOM.render`.  
### Arguments  
#### Instance of `Root` component.
###### required  
[`Root`](#root)  
```jsx
render(  
    <Root bot={new UrbanBotTelegram(options)}>  
        <YourApp />    
    </Root>  
);
```  
#### Callback
It's called when your app is initialized.
###### optional
`Function`
```jsx
render(  
    ...,  
    () => console.log('App has started')
);
```  

## Common props
#### isNewMessageEveryRender
> If `true`, a new message is sent after every state update. If `false`, a message is sent one time and edited next state updates.
###### optional  
`boolean`  
```jsx
function Example() {
    const [text, setText] = React.useState('1');

    return <Text isNewMessageEveryRender>{text}</Text>
}

// setText('2')
// setText('3')

// chat:
// bot write: '1'
// bot write: '2'
// bot write: '3'
``` 
```jsx
function Example() {
    const [text, setText] = React.useState('1');

    return <Text isNewMessageEveryRender={false}>{text}</Text>
}

// setText('2')
// setText('3')

// chat:
// bot write: '3'
``` 
#### title
>  A text is sent with the main message.
###### optional  
[`HTML`](#html)
```jsx
<Image title="some text" />  
``` 
```jsx
<Image title={<b>some text</b>} />  
```  
#### buttons
> Buttons are attached to a message.
###### optional  
[`ButtonGroup`](#buttongroup)
```jsx
<Image
    file={image}
    buttons={  
        <ButtonGroup>  
            <Button onClick={() => setUrl(nextImage)}>Next</Button>  
            <Button onClick={() => setUrl(prevImage)}>Previous</Button>  
        </ButtonGroup>  
    }  
/>  
```  
#### parseMode
>  The markup language which is used for parsing text. Calculated automatically for every messenger, but you can specify directly.
###### optional  
`'HTML'` | `'markdown'`
```jsx
// '<b>bold</b>'
<Text parseMode="HTML">
    <b>bold</b>
</Text> 
```
```jsx
// '*bold*'
<Text parseMode="markdown">
    <b>bold</b> 
</Text> 
```
```jsx
// '*bold*'
<Image parseMode="markdown" title={<b>bold</b>} /> 
```
You can pass usual text with ready formatting.
```jsx
<Text parseMode="HTML">{'<b>bold</b>'}</Text>
```  
```jsx
<Text parseMode="markdown">*bold*</Text>
```  
#### disableNotification  
> Sending a message silently.
###### optional  
`boolean`  
```jsx
<Text disableNotification>Mam, I will be late today</Text>
``` 
#### replyToMessageId  
> Specify if you want to send a message as a reply to another message.
###### optional  
`string`  | `number`  
```jsx
<Text replyToMessageId="some-id">Yes, I agree!</Text>
``` 
#### personaId 
> Some messengers support sending messages from different persons inside one chat.
###### optional  
`string`  | `number`  
```jsx
<Text personaId="natalie-id">Hi, I am Natalie. How can I help you?</Text>
``` 
#### forceReply 
> After sending a message next user message automatically replies to the sent message.
###### optional  
`boolean`
```jsx
<Text forceReply>What's your name?</Text>
``` 
### HTML  
> Plain text or HTML tags.  

##### Plain text
`string` | `number` 
##### Bold
```jsx
<b>bold</b>
<strong>bold</strong>
```
##### Italic
```jsx
<i>italic</i>
<em>italic</em>
```
##### Underline
```jsx
<u>underline</u>
<ins>underline</ins>
```
##### Strikethrough
```jsx
<s>strikethrough</s>
<strike>strikethrough</strike>
<del>strikethrough</del>
```
##### Code
```jsx
<code>code</code>
<pre>code</pre>
```
##### Quote text  
```jsx
<q>text</q>
``` 
##### Link
 ```jsx
 <a href="https://github.com/urban-bot/urban-bot">Link</a>
 ```
##### Line break
 ```jsx
 <br />
 ```
## Root
A required component which you should wrap over your application. It connects specific messenger to the core, provides the main context, manages multiple chats, and start the server.  
```jsx
render(  
    <Root bot={new UrbanBotTelegram(options)}>  
        <YourApp />    
    </Root>  
);  
```  
For multiple messengers, you should create several `Root`.  
```jsx
render(  
    <Root bot={new UrbanBotTelegram(options)}>  
        <YourApp />    
    </Root>  
);  
render(  
    <Root bot={new UrbanBotFacebook(options)}>  
        <YourApp />  
    </Root>  
);  
```  
### Props

####  children  
> Entry point of your app.  
###### required  
`ReactNode`  
```jsx
function YourApp() {  
   return <Text>Hello World!</Text>;  
}
  
render(  
    <Root bot={new UrbanBotTelegram(options)}>  
        <YourApp />    
    </Root>  
);  
```  
####  bot  
>  An instance of specific UrbanBot*. 
###### required  
`UrbanBot` 
```jsx
import { UrbanBotTelegram } from '@urban-bot/telegram';
  
render(  
    <Root bot={new UrbanBotTelegram(options)}>  
        <YourApp />    
    </Root>  
);  
```  
####  sessionTimeSeconds  
>  Time after which the user session is clear
###### optional  
###### default `60 * 60 * 24 * 7`
`number`
```jsx
render(  
    <Root sessionTimeSeconds={Infinity}>  
        <YourApp />    
    </Root>  
);  
```  
####  port  
>  Port to start server.
###### optional  
###### default `8080`
`number`
```jsx
render(  
    <Root port={3000}>  
        <YourApp />    
    </Root>  
);
```  
If you use several messengers you can use the same or use a unique port for each.
```jsx
render(  
    <Root bot={new UrbanTelegramBot(options)} port={3000}>  
        <YourApp />    
    </Root>  
);

render(  
    <Root bot={new UrbanSlackBot(options)} port={3000}>
        <YourApp /> 
    </Root>  
);

render(  
    <Root bot={new UrbanFacebookBot(options)} port={4000}>
        <YourApp />    
    </Root>  
);  
``` 
#### [isNewMessageEveryRender](#isnewmessageeveryrender)
> Default value for all urban-bot components under Root.
###### default `true`
```jsx
function MyAudio() {
    return <Audio file="/some-audio.mp3" />
}

render(
    <Root isNewMessageEveryRender>  
        <Text>some text</Text>
        <Image file="https://path-to-image.jpg" />
        <MyAudio />
    </Root>  
); 

// Text, Image, Audio are with isNewMessageEveryRender={true}
```
#### [parseMode](#parsemode)
> Default value for all urban-bot components under Root.

## Router
Separate different parts of your application by Router. 
```jsx
function Profile() {
    return ...
}

function Catalog() {
    return ...
}

function App() {
    return (
        <Router>
            <Route path="profile">  
                <Profile />  
            </Route>
            <Route path="catalog">  
                <Catalog />  
            </Route>
        </Router>
    );
}
```  
Now if a user type 'profile' or 'catalog' urban-bot renders a corresponding component.

Also, you can navigate inside your app without messaging by using a router context.
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
### Props
####  children  
> One or many Route components.
###### required  
[`Route`](#route)
#### withInitializeCommands
> If you pass commands to path prop every specific bot can initialize them. For example auto-suggesting command if a user starts to type it.
###### optional  
###### default `false`  
```jsx
<Router withInitializeCommands>
    ...
</Router>
```
## Route
Piece of [Router](#router).
```jsx
<Route path="profile">  
    <Profile />  
</Route>
```
### Props
####  children  
> Part of your application.  
###### required  
`ReactNode` 
####  path  
> String or regexp which is connected with Route children.
###### required  
`string` | `RexExp` 
```jsx
<Route path="profile">
    ...
</Route>
```
```jsx
<Route path="/profile">
    ...
</Route>
```
```jsx
<Route path={/.+/}>
    <Text>Not found</Text>
</Route>
```
####  description  
> Describe your Route. Usually is needed for [withInitializeCommands](#withinitializecommands).
###### optional  
`string`
```jsx
<Route path="profile" description="Some information about you">
    ...
</Route>
```
## Text  
Send a text message to a chat.  
```jsx
<Text>Some text<Text>    
```    
### Props  
####  children  
> Plain text or supported HTML tags.  
###### required  
[`HTML`](#html)  
```jsx
<Text>      
    Usual text      
    <br />      
    <b>Bold text</b>      
    <br />      
    <i>Italic text</i>      
    <b>      
        Bold and <s>Strikethrough text</s>      
    </b>  
    ...  
</Text>    
```  
#### disableWebPagePreview  
> Some messengers show web page preview if you attach a link in your text. Set to `true` if you want to disable this behavior.  
###### optional  
`boolean`  
```jsx
<Text disableWebPagePreview>  
    <a href="https://github.com/urban-bot/urban-bot">link</a>  
<Text>  
```  
#### [isNewMessageEveryRender](#isnewmessageeveryrender)
#### [parseMode](#parsemode)
#### [disableNotification](#disablenotification)
#### [replyToMessageId](#replytomessageid)
#### [personaId](#personaid)
#### [forceReply](#forcereply)
## ButtonGroup  
Required wrapper for buttons.  
```jsx
<ButtonGroup>  
    <Button onClick={() => console.log('Click first')}>First</Button>  
    <Button onClick={() => console.log('Click second')}>Second</Button>  
</ButtonGroup>  
```  
### Props    
#### children  
>  An instance or instances of `Button`.
###### required  
[`Button`](#Button) | [`Button`](#Button)[] | [`Button`](#Button)[][]
```jsx
<ButtonGroup title="Button">  
    <Button>First</Button>  
</ButtonGroup>  
```  
```jsx
<ButtonGroup title="Buttons">  
    <Button>First</Button>  
    <Button>Second</Button>  
</ButtonGroup>  
```  
```jsx
<ButtonGroup title="Matrix Buttons">  
    {[  
        [<Button>First button</Button>, <Button>Second button</Button>],  
        [<Button>Third button</Button>, <Button>Fourth button</Button>],  
    ]}  
</ButtonGroup>  
```  
  
#### isReplyButtons  
> Send button name as text after every click.
###### optional
`boolean`

If a user clicks on the button, he automatically sends 'Hello' message.
```jsx
<ButtonGroup isReplyButtons>
    <Button>Hello</Button>
</ButtonGroup>  
```  
#### [title](#title)
#### [isNewMessageEveryRender](#isnewmessageeveryrender)
#### [parseMode](#parsemode)
#### [disableNotification](#disablenotification)
#### [replyToMessageId](#replytomessageid)
#### [personaId](#personaid)
#### [forceReply](#forcereply)
## Button  
Button, just button.  
```jsx
<Button>Text</Button>  
```  
### Props  
#### children  
> Button name.  
###### required  
`string`  
#### onClick  
> Callback is called after click.  
###### optional  
`Function`  
```jsx
<Button onClick={() => console.log('Click first')}>First</Button>  
```  
#### url  
> The web page is opened after a click.  
###### optional  
`string`  
```jsx
<Button url="http://some-url.com">Open a web page</Button>  
```  
#### phoneNumber  
> The phone number is suggested to call after a click.
###### optional  
`string` | `number`  
```jsx
<Button phoneNumber="+71234567890">Call Saul Goodman</Button>  
```  
#### id  
> The unique id. If you don't specify it, it is generated automatically.  
###### optional  
`string`  
```jsx
<Button id="some-id">First</Button>  
```  
## Image  
Send an image to a chat.  
```jsx
<Image file="https://path-to-image.png" />  
```    
### Props
#### file  
> File id or URL or Stream or Buffer.  
###### required  
`string` | `Buffer` | `ReadableStream`  
```jsx
<Image file="id123" />  
```  
```jsx
<Image file="https://path-to-image.png" />  
```  
```jsx
<Image file={fs.createReadStream('/files/image.jpg')} />  
```  
```jsx
<Image file={fs.readFileSync('/files/image.jpg')} />  
```
#### name
###### optional
`string`
```jsx
<Image name="a big cat" />
``` 
#### alt  
> Text if an image is not displayed.  
###### optional  
`string`  
```jsx
<Image alt="This is cat" />  
```  
#### [title](#title)
#### [buttons](#buttons)
#### [isNewMessageEveryRender](#isnewmessageeveryrender)
#### [parseMode](#parsemode)
#### [disableNotification](#disablenotification)
#### [replyToMessageId](#replytomessageid)
#### [personaId](#personaid)
#### [forceReply](#forcereply)

## Video  
Send a video to a chat.
```jsx
<Video file="https://path-to-video.mp4" />
```
### Props
#### file  
> File id or URL or Stream or Buffer.  
###### required  
`string` | `Buffer` | `ReadableStream`  
```jsx
<Video file="id123" />
```  
```jsx
<Video file="https://path-to-video.mp4" />
```  
```jsx
<Video file={fs.createReadStream('/files/video.mp4')} />
```  
```jsx
<Video file={fs.readFileSync('/files/video.mp4')} />  
```  
#### name
###### optional
`string`
```jsx
<Video name="I'm a cook" />
``` 
#### author  
###### optional
`string`
```jsx
<Video author="Leeroy Jenkins" />
``` 
#### width  
###### optional
`number`
```jsx
<Video width={200} />
``` 
#### height  
###### optional
`number`
```jsx
<Video height={200} />
``` 
#### duration
###### optional
`number`
```jsx
<Video duration={10} />
``` 
#### [title](#title)
#### [buttons](#buttons)
#### [isNewMessageEveryRender](#isnewmessageeveryrender)
#### [parseMode](#parsemode)
#### [disableNotification](#disablenotification)
#### [replyToMessageId](#replytomessageid)
#### [personaId](#personaid)
#### [forceReply](#forcereply)


## Audio
Send an audio to a chat.
```jsx
<Audio file="https://path-to-audio.mp3" />
```
### Props
#### file  
> File id or URL or Stream or Buffer.  
###### required  
`string` | `Buffer` | `ReadableStream`  
```jsx
<Audio file="id123" />
```  
```jsx
<Audio file="https://path-to-audio.mp3" />
```  
```jsx
<Audio file={fs.createReadStream('/files/audio.mp3')} />
```  
```jsx
<Audio file={fs.readFileSync('/files/audio.mp3')} />  
```  
#### name
###### optional
`string`
```jsx
<Audio name="Morning Mood" />
``` 
#### author  
###### optional
`string`
```jsx
<Audio author="Edvard Grieg" />
``` 
#### duration
###### optional
`number`
```jsx
<Audio duration={10} />
``` 
#### [title](#title)
#### [buttons](#buttons)
#### [isNewMessageEveryRender](#isnewmessageeveryrender)
#### [parseMode](#parsemode)
#### [disableNotification](#disablenotification)
#### [replyToMessageId](#replytomessageid)
#### [personaId](#personaid)
#### [forceReply](#forcereply)

## Animation
Send an animation to a chat.
```jsx
<Animation file="https://path-to-animation.gif" />
```
### Props
#### file
> File id or URL or Stream or Buffer.  
###### required
`string` | `Buffer` | `ReadableStream`  
```jsx
<Animation file="id123" />
```  
```jsx
<Animation file="https://path-to-audio.gif" />
```  
```jsx
<Animation file={fs.createReadStream('/files/animation.gif')} />
```  
```jsx
<Animation file={fs.readFileSync('/files/animation.gif')} />  
```  
#### name
###### optional
`string`
```jsx
<Animation name="Say my name" />
```
#### duration
###### optional
`number`
```jsx
<Animation duration={10} />
```
#### width
###### optional
`number`
```jsx
<Animation width={200} />
```
#### height  
###### optional
`number`
```jsx
<Animation height={200} />
``` 
#### [title](#title)
#### [buttons](#buttons)
#### [isNewMessageEveryRender](#isnewmessageeveryrender)
#### [parseMode](#parsemode)
#### [disableNotification](#disablenotification)
#### [replyToMessageId](#replytomessageid)
#### [personaId](#personaid)
#### [forceReply](#forcereply)

## File
Send a file to a chat.
```jsx
<File file="https://path-to-file.pdf" />
```
### Props
#### file  
> File id or URL or Stream or Buffer.  
###### required  
`string` | `Buffer` | `ReadableStream`  
```jsx
<File file="id123" />
```  
```jsx
<File file="https://path-to-file.pdf" />
```  
```jsx
<File file={fs.createReadStream('/files/file.pdf')} />
```  
```jsx
<File file={fs.readFileSync('/files/file.pdf')} />  
```  
#### name
###### optional
`string`
```jsx
<File name="report_21.03.15" />
``` 
#### [title](#title)
#### [buttons](#buttons)
#### [isNewMessageEveryRender](#isnewmessageeveryrender)
#### [parseMode](#parsemode)
#### [disableNotification](#disablenotification)
#### [replyToMessageId](#replytomessageid)
#### [personaId](#personaid)
#### [forceReply](#forcereply)


## Media
Send a group of media files.
```jsx
<Media
    files={[
        {
            type: 'image',
            file: 'https://path-to-image1.jpg',
            title: 'image1'
        },
        {
            type: 'image',
            file: 'https://path-to-image2.jpg',
            title: 'image2'
        }
    ]}
/>
```
### Props
#### files
###### required
[`Media File`](#media-file)[]
#### [isNewMessageEveryRender](#isnewmessageeveryrender)
#### [parseMode](#parsemode)
#### [disableNotification](#disablenotification)
#### [replyToMessageId](#replytomessageid)
#### [personaId](#personaid)
#### [forceReply](#forcereply)
### Media File
#### type
###### required
`'image'` | `'video'`
```jsx
<Media
    files={[
        {
            type: 'image',
            // ...
        },
        {
            type: 'video',
            // ...
        }
    ]}
/>
```
#### [Image props](#props-5)
#### [Video props](#props-6)
```jsx
<Media
    files={[
        {
            type: 'image',
            file: 'https://path-to-image.png',
            title: 'a big cat'
        },
        {
            type: 'video',
            file: 'https://path-to-video.mp4',
            duration: 10
        }
    ]}
/>
```
## Location
Send a location.
```jsx
<Location latitude={60.734539} longitude={77.608548}  />
```
### Props
#### latitude
> Latitude coordinate.
###### required
`number`
#### longitude
> Longitude coordinate.
###### required
`number`
#### livePeriodSeconds
> A period when a location can be updated online.
###### required
`number`
```jsx
<Location livePeriodSeconds={60 * 30} />
```
#### [title](#title)
#### [buttons](#buttons)
#### [isNewMessageEveryRender](#isnewmessageeveryrender)
#### [parseMode](#parsemode)
#### [disableNotification](#disablenotification)
#### [replyToMessageId](#replytomessageid)
#### [personaId](#personaid)
#### [forceReply](#forcereply)

## Poll
Send a poll.
```jsx
<Poll question="Do you like Urban Bot?">
    <Option>Yes</Option>
    <Option>Of course</Option>
    <Option>Сertainly</Option>
</Poll>
```
### Props
#### children
###### required
[`Option`](#option) | [`Option`](#option)[]
#### question
###### required
`string`
```jsx
<Poll question="Do you like Urban Bot?">...</Poll>
```
#### withMultipleAnswers
###### optional
`boolean`
```jsx
<Poll withMultipleAnswers>...</Poll>
```
#### isAnonymous
###### optional
`boolean`
```jsx
<Poll isAnonymous>...</Poll>
```
#### rightOption
> If it is a quiz you can set a right answer.
###### optional
`string` | `number`
```jsx
<Poll rightOption={1}>...</Poll>
```
#### explanation
> If it is a quiz you can set an explanation of right answer.
###### optional
`string`
```jsx
<Poll explanation="2 + 2 = 4">...</Poll>
```
#### livePeriodSeconds
> A period when a poll can be active.
###### optional
`number`
```jsx
<Poll livePeriodSeconds={60 * 30}>...</Poll>
```
#### type
###### optional
`string`
```jsx
<Poll type="quiz">...</Poll>
```
#### [title](#title)
#### [buttons](#buttons)
#### [isNewMessageEveryRender](#isnewmessageeveryrender)
#### [parseMode](#parsemode)
#### [disableNotification](#disablenotification)
#### [replyToMessageId](#replytomessageid)
#### [personaId](#personaid)
#### [forceReply](#forcereply)

## Option
> Piece of [Poll](#poll).
```jsx
<Option>Yes</Option>
```
### Props
#### children
###### required
`string`
#### id  
> The unique id. If you don't specify it, it is generated automatically.  
###### optional  
`string`  
```jsx
<Option id="some-id">Yes</Option>  
```  
## Contact
Send a contact.
```jsx
<Contact firstName="Kamola" phoneNumber="+71234567890" />;
```
### Props
#### phoneNumber  
###### optional  
`string` | `number`  
```jsx
<Contact phoneNumber="+71234567890" />
```
#### username  
###### optional  
`string`
```jsx
<Contact username="ledamint" />
```
#### firstName  
###### optional  
`string`
```jsx
<Contact firstName="Vanya" />
```
#### lastName  
###### optional  
`string`
```jsx
<Contact lastName="Che Guevara" />
```  
#### vCard  
###### optional  
`string`
#### [title](#title)
#### [buttons](#buttons)
#### [isNewMessageEveryRender](#isnewmessageeveryrender)
#### [parseMode](#parsemode)
#### [disableNotification](#disablenotification)
#### [replyToMessageId](#replytomessageid)
#### [personaId](#personaid)
#### [forceReply](#forcereply)
