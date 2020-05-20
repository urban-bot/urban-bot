
# Urban Bot Components  

* [Text](#text)
* [Image](#image)
  
## Text
Send a text message to a chat.
```javascript  
<Text>Some text<Text>  
```  
### Props  
#### __[Common props](#common-props)__
#### __disableWebPagePreview__
Some messengers show web page preview if you attach a link in your text. Set to `true` if you want to block this behavior.
##### type
###### optional
`boolean`
```javascript
<Text disableWebPagePreview>
    <a href="https://github.com/urban-bot/urban-bot">link</a>
<Text>
```
* ####  children
Text or html tags
##### type
###### required

* `string`  
* `number`  
* `<b>bold</b>` `<strong>bold</strong>`  **bold**
* `<i>italic</i>` `<em>italic</em>`  *italic*  
* `<u>underline</u>` `<ins>underline</ins>`  underline
* `<s>strikethrough</s>` `<strike>strikethrough</strike>` `<del>strikethrough</del>`   ~~strikethrough~~  
* `<code>code</code>` `<pre>code</pre>` `code`  
* `<q>text</q>`  quote text
* `<a href="https://github.com/urban-bot/urban-bot">Link</a>`  [Link](https://github.com/urban-bot/urban-bot)  
* `<br />`  Line break  

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
## Image
Send an image to a chat.
```javascript
<Image file="https://path-to-image.com" />
```  
### Props  
* #### [Common props](#common-props)
* #### file
File id or URL or Stream or Buffer.
##### type
###### required
`string` | `Buffer` | `NodeJS.ReadableStream`
```javascript
<Image file="id123" />
<Image file="https://path-to-image.com" />
<Image file={fs.createReadStream('/files/image.jpeg')} />
<Image file={fs.readFileSync('/files/image.jpeg')} />
```

### Common props
```
const commonProps = {
  parseMode?: 'HTML' | 'markdown';
  disableNotification?: boolean;
  replyToMessageId?: string;
  forceReply?:boolean;
  personaId?: number | string;
  isNewMessageEveryRender?: boolean;
}

