
# Documentation  
  
## Components  
### Common props  
  
```  
parseMode?: 'HTML' | 'markdown';  
disableNotification?: boolean; 
replyToMessageId?: string;
forceReply?:boolean; personaId?: number | string;  
isNewMessageEveryRender?: boolean;  
```  
  
### Text  
Send  text to chat  
```javascript  
<Text>Some text<Text>  
```  
#### Props  
Common props and  

`disableWebPagePreview?: boolean;`

#### Children  
Could be string, number and supported tags:  
  
* `<b>bold</b>` `<strong>bold</strong>`  **bold**
* `<i>italic</i>` `<em>italic</em>`  *italic*  
* `<u>underline</u>` `<ins>underline</ins>`  underline
* `<s>strikethrough</s>` `<strike>strikethrough</strike>` `<del>strikethrough</del>`   ~~strikethrough~~  
* `<code>code</code>` `<pre>code</pre>` `code`  
* `<q>text</q>`  quote text
* `<a href="https://github.com/urban-bot/urban-bot">Link</a>`  [Link](https://github.com/urban-bot/urban-bot)  
* `<br />`  Line break  
  

  
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
... </Text>  
```
