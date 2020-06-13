---
id: get-started-telegram
title: Telegram
sidebar_label: Telegram
---

Instruction on how to start developing Telegram bot.

## Local development
### Video instruction

<iframe width="560" height="315" src="https://www.youtube.com/embed/WqyOCZMDSpg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Steps

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

> If you see error looks like 
> `error: [polling_error] {"code":"EFATAL","message":"EFATAL: Error: connect ECONNREFUSED 127.0.0.1:9150"}`
> probably an internet provider blocks Telegram connection. You need to use a VPN, or you could use the Tor browser, see the [example](https://github.com/urban-bot/urban-bot/tree/master/examples/telegram-proxy-tor).

## Deploy
