# Documentation

## Components
### Common props

```
parseMode?: 'HTML' | 'markdown';
disableNotification?: boolean;  
replyToMessageId?: string;  
forceReply?: boolean;  
personaId?: number | string;
isNewMessageEveryRender?: boolean;
```

### Text
Send  text to chat
```javascript
<Text>Some text<Text>
```
#### Props
Common props and
```
disableWebPagePreview?: boolean;
```
#### Children
Could be string, number and supported tags:

**bold text**

`<b>text</b>` `<strong>text</strong>`

 *italic text*
 
`<i>text</i>` `<em>text</em>`

 underline text
 
`<u>text</u>` `<ins>text</ins>`

~~strikethrough text~~

`<s>text</s>` `<strike>text</strike>` `<del>text</del>` 

`code text`

 `<code>text</code>` `<pre>text</pre>  ` 
 
 > quote text
 
 `<q>text</q>`
 
  [Link](https://github.com/urban-bot/urban-bot)
  
 `<a href="https://github.com/urban-bot/urban-bot">Link</a>`
 
Line break

`<br />`

**Example**
```jvascript
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




