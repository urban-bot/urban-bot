# Urban Bot Docs  
  
 * [render](#render)
 * [Components](#components)
    * [Common props](#common-props)
	* [Root](#root)  
	* [Router](#router)  
	* [Text](#text)  
	* [ButtonGroup](#buttongroup)  
	* [Button](#button)  
	* [Image](#image)
  
All variables you can import from `@urban-bot/core`.  
```javascript    
import { render, Root, Text } from '@urban-bot/core';  
```  
```javascript  
const { render, Root, Text } = require('@urban-bot/core');  
```  
## render  
The main function that starts React. Works similar `ReactDOM.render`.  
### Arguments  
####  1  
> Instance of `Root` component.  
###### required  
[`Root`](#root)  
```javascript    
render(  
    <Root bot={new UrbanBotTelegram(options)}>  
        <YourApp />    
    </Root>  
);  
```  
####  2  
> A callback will be called when your app is initialized.  
###### optional  
```javascript    
render(  
    ...,  
    () => console.log('App has started'),  
);  
```  
 
# Components
### Common props
#### isNewMessageEveryRender
> If `true` urban-bot will send a new messsage after every state update. If `false` message will be sended one time and edited  every time.
###### optional  
`boolean`  
```javascript
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
```javascript
function Example() {
    const [text, setText] = React.useState('1');

    return <Text isNewMessageEveryRender={false}>{text}</Text>
}

// setText('2')
// setText('3')

// chat:
// bot write: '3'
``` 
#### parseMode
>  The markup language which is used for parsing text. Calculated automatically for every messenger, but you can specify directly.
###### optional  
`'HTML'` | `'markdown'`
```javascript  
<Text parseMode"HTML"><b>bold</b></Text> // '<b>bold</b>'
```  
```javascript  
<Text parseMode"markdown"><b>bold</b></Text> // '*bold*' 
```
```javascript  
<Image parseMode"markdown" title={<b>bold</b>} /> // '*bold*' 
```
You can pass usual text with ready formatting.
```javascript  
<Text parseMode"HTML">{'<b>bold</b>'}</Text>
```  
```javascript  
<Text parseMode"markdown">*bold*</Text>
```  
#### disableNotification  
> Sending a message silently.
###### optional  
`boolean`  
```javascript  
<Text disableNotification>Mam, I will be late today</Text>
``` 
#### replyToMessageId  
> Specify if you want to send a message as a reply to another message.
###### optional  
`string`  | `number`  
```javascript  
<Text replyToMessageId="some-id">Yes, I agree!</Text>
``` 
#### personaId 
> Some messengers support sending messages from different persons inside one chat.
###### optional  
`string`  | `number`  
```javascript
<Text personaId="natalie-id">Hi, I am Natalie. How can I help you?</Text>
``` 
#### forceReply 
> After sending a message next user message will automatically reply to the message.
###### optional  
`boolean`
```javascript
<Text forceReply>What's your name?</Text>
``` 
### HTML  
> Plain text or HTML tags.  

##### Plain text
`string`    
`number` 
##### Bold
```javascript
<b>bold</b>
<strong>bold</strong>
```
##### Italic
```javascript
<i>italic</i>
<em>italic</em>
```
##### Underline
```javascript
<u>underline</u>
<ins>underline</ins>
```
##### Strikethrough
```javascript
<s>strikethrough</s>
<strike>strikethrough</strike>
<del>strikethrough</del>
```
##### Code
```javascript
<code>code</code>
<pre>code</pre>
```
##### Quote text  
```javascript
<q>text</q>
``` 
##### Link
 ```javascript
 <a href="https://github.com/urban-bot/urban-bot">Link</a>
 ```
##### Line break
 ```javascript
 <br />
 ```
## Root
A required component which you should wrap over your application. It connects specific messenger to the core, provides the main context, manages multiple chats, and start the server.  
```javascript  
render(  
    <Root bot={new UrbanBotTelegram(options)}>  
        <YourApp />    
    </Root>  
);  
```  
For multiple messengers, you should create several `Root`.  
```javascript  
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
```javascript    
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
```javascript    
import { UrbanBotTelegram } from '@urban-bot/telegram';
  
render(  
    <Root bot={new UrbanBotTelegram(options)}>  
        <YourApp />    
    </Root>  
);  
```  
####  sessionTimeSeconds  
>  Urban Bot will be clear session data for a user after this time.
###### optional  
###### default `60 * 60 * 24 * 7`
`number`
```javascript    
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
```javascript    
render(  
    <Root port={3000}>  
        <YourApp />    
    </Root>  
);
```  
If you use several messengers you could use the same or use a unique port for each.
```javascript    
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
> Specify default value for all urban-bot components under Root.
###### default `false`
```javascript
function MyAudio() {
    return <Audio file="/some-audio.mp3" />
}

render(
    <Root isNewMessageEveryRender={false}>  
        <>
            <Text>some text</Text>
            <Image file="https://path-to-image.com" />
            <MyAudio />
        </>
    </Root>  
); 

// Text, Image, Audio will be with isNewMessageEveryRender={false}
```
#### [parseMode](#parsemode)
> Specify default value for all urban-bot components under Root.

## Router
You could separate different parts of your application by Router. 
```javascript
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
Now if a user type 'profile' or 'catalog' urban-bot will render a corresponding component.

Also you can navigate inside your app without messaging by using a router context.
```javascript
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
> If you pass commands to path prop every specific bot could initialize them. For example auto-suggesting command if a user starts to type it.
###### optional  
###### default `false`  
```javascript
<Router withInitializeCommands>
    ...
</Router>
```
## Text  
Send a text message to a chat.  
```javascript    
<Text>Some text<Text>    
```    
### Props  
####  children  
> Plain text or supported HTML tags.  
###### required  
[`HTML`](#HTML)  
```javascript    
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
> Some messengers show web page preview if you attach a link in your text. Set to `true` if you want to block this behavior.  
###### optional  
`boolean`  
```javascript  
<Text disableWebPagePreview>  
    <a href="https://github.com/urban-bot/urban-bot">link</a>  
<Text>  
```  
#### [isNewMessageEveryRender](#isnewmessageeveryrender)
#### [parseMode](#parsemode)
#### [replyToMessageId](#replytomessageid)
#### [personaId](#personaid)
#### [forceReply](#forcereply)
## ButtonGroup  
Required wrapper for buttons.  
```javascript  
<ButtonGroup>  
    <Button onClick={() => console.log('Click first')}>First</Button>  
    <Button onClick={() => console.log('Click second')}>Second</Button>  
</ButtonGroup>  
```  
### Props    
#### [Common props](#common-props)
#### children  
>  An instance or instances of `Button`.
###### required  
[`Button`](#Button) [`Button`](#Button)[] [`Button`](#Button)[][]
```javascript  
<ButtonGroup title="Button">  
    <Button>First</Button>  
</ButtonGroup>  
```  
```javascript  
<ButtonGroup title="Buttons">  
    <Button>First</Button>  
    <Button>Second</Button>  
</ButtonGroup>  
```  
```javascript  
<ButtonGroup title="Matrix Buttons">  
    {[  
        [<Button>First button</Button>, <Button>Second button</Button>],  
        [<Button>Third button</Button>, <Button>Fourth button</Button>],  
    ]}  
</ButtonGroup>  
```  
  
#### title  
>  Plain text or supported HTML tags.  
###### optional  
[`HTML`](#HTML)  
```javascript  
<ButtonGroup title="text">...</ButtonGroup>  
```  
```javascript  
<ButtonGroup title={<b>text</b>}>...</ButtonGroup>  
```  
#### isReplyButtons  
> Send button name as text after every click.
###### optional
`boolean`

After click will be the same as a user write 'Hello'.
```javascript  
<ButtonGroup isReplyButtons>
    <Button>Hello</Button>
</ButtonGroup>  
```  
  #### [isNewMessageEveryRender](#isnewmessageeveryrender)
#### [parseMode](#parsemode)
#### [replyToMessageId](#replytomessageid)
#### [personaId](#personaid)
#### [forceReply](#forcereply)
## Button  
Button, just button.  
```javascript  
<Button>Text</Button>  
```  
### Props  
#### children  
> Button name.  
###### required  
`string`  
#### onClick  
> Callback will be called after click.  
###### optional  
`Function`  
```javascript  
<Button onClick={() => console.log('Click first')}>First</Button>  
```  
#### url  
> The web page will be open after click.  
###### optional  
`string`  
```javascript  
<Button url="http://some-url.com">Open a web page</Button>  
```  
#### phoneNumber  
> The phone number will be suggested to call after click.  
###### optional  
`string` `number`  
```javascript  
<Button phoneNumber="+71234567890">Call Saul Goodman</Button>  
```  
#### id  
> Unique id. If you don't specify it, it will be generated automatically.  
###### optional  
`string`  
```javascript  
<Button id="some-id">First</Button>  
```  
## Image  
Send an image to a chat.  
```javascript  
<Image file="https://path-to-image.com" />  
```    
### Props    
#### file  
> File id or URL or Stream or Buffer.  
###### required  
`string` | `Buffer` | `NodeJS.ReadableStream`  
```javascript  
<Image file="id123" />  
```  
```javascript  
<Image file="https://path-to-image.com" />  
```  
```javascript  
<Image file={fs.createReadStream('/files/image.jpeg')} />  
```  
```javascript  
<Image file={fs.readFileSync('/files/image.jpeg')} />  
```  
#### title  
>  Plain text or supported HTML tags.  
###### optional  
[`HTML`](#HTML)
```javascript  
<Image title="text" />  
```  
```javascript  
<Image title={<b>text</b>} />  
```  
#### buttons
> Buttons will be attached with image.
###### optional  
[`ButtonGroup`](#buttongroup)
```javascript  
<Image  
    buttons={  
        <ButtonGroup>  
            <Button>First</Button>  
            <Button>Second</Button>  
        </ButtonGroup>  
    }  
/>  
```  
#### alt  
> Text if image is not loaded.  
###### optional  
`string`  
```javascript  
<Image alt="This is cat" />  
```  
#### [isNewMessageEveryRender](#isnewmessageeveryrender)
#### [parseMode](#parsemode)
#### [replyToMessageId](#replytomessageid)
#### [personaId](#personaid)
#### [forceReply](#forcereply)
