---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---
Urban Bot is a library that allows easily to develop complex chatbots on any platform. 

It uses <a href="https://github.com/facebook/react" target="_blanck">**React**</a> so you can use all advantages like a declarative programming, "client-side rendering", rich ecosystem, and easy reusing different parts of applications. 

Urban Bot uses **[components](components.md)** to send messages to users and **[hooks](hooks.md)** to subscribe to messages from users.

## Installation
The easiest way to start using Urban Bot is our starter.

Just write in your terminal.
##### For using typescript
```shell
npx create-urban-bot my-app
```
##### For using javascript
```shell
npx create-urban-bot my-app --template js
```
_(to use `npx` you need npm 5.2+ and higher, see <a href="https://gist.github.com/gaearon/4064d3c23a77c74a3614c498a8bb1c5f" target="_blank">instructions for older npm versions</a>)_

After downloading your new app will be inside `my-app` directory where you ran the command.

Now we need to set up specific messengers to start work with them.
## Telegram
### Local development
#### Video instruction

<iframe width="560" height="315" src="https://www.youtube.com/embed/WqyOCZMDSpg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

#### Steps

1. To start work with <a href="https://telegram.org/" target="_blank">telegram</a> you have to get <a href="https://core.telegram.org/bots#6-botfather" target="_blank">telegram token</a>
from <a href="https://t.me/botfather" target="_blank">@BotFather</a>. Write to BotFather `/newbot`, write display name of your new bot, then username and you should get telegram token.

![alt-text](assets/telegram-token.gif)

2. Then open `my-app` directory which you have install via [`create-urban-bot`](#installation) and paste the telegram token to `.env` file.
<details>
<summary>telegram token in .env</summary>
![telegram-token-env](assets/telegram-token-env.png)
</details>

3. After this open `src/index.ts` or `src/index.js` and uncomment `// import './render/telegram';`
<details>
<summary>src/index</summary>
![telegram-token-env](assets/telegram-render.png)
</details>

4. Your bot is ready to launch! Run `npm run dev` in `my-app` directory and write something to your bot. It should work as default app with two commands `/echo` and `/logo`.
