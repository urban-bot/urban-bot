# Urban Bot Docs  
  
* [render](#render)  
* [Root](#root)  
* [Text](#text)  
* [ButtonGroup](#buttongroup)  
* [Button](#button)  
* [Image](#image)  
  
All components you could import from `@urban-bot/core`.  
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
## Text  
Send a text message to a chat.  
```javascript    
<Text>Some text<Text>    
```    
### Props  
#### [Common props](#common-props)  
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
#### [Common props](#common-props)  
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
## Common 

### Props
### parseMode
>  The markup language which is used for parsing text. Calculated automatically for every messenger, but you can specify directly.
###### optional  
`'HTML'` | `'markdown'`
```javascript  
<Text parseMode"HTML"><b>text</b></Text> // '<b>bold</b>'
```  
```javascript  
<Text parseMode"markdown"><b>text</b></Text> // '*bold*' 
```
```javascript  
<Image parseMode"markdown" title={<b>text</b>} /> // '*bold*' 
```
You can provide usual text with ready formatting.
```javascript  
<Text parseMode"HTML">{'<b>text</b>'}</Text>
```  
```javascript  
<Text parseMode"markdown">*bold*</Text>
```  
#### disableNotification  
> Sending a message silently.
###### optional  
`boolean`  
```javascript  
<Text disableNotification>text</Text>
``` 
### Other
#### HTML  
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