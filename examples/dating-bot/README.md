
# Urban Bot Starter

Develop chatbots with zero configuration.

Included:
* **compiler** - *typescript*
* **linter** - *eslint*
* **code formatter** - *prettier*
* **test** - *jest*
* **pre-commit** - *husky & lint-staged*
* **live reload** - *nodemon*

## Launch
```
$ git clone git@github.com:urban-bot/urban-bot-starter.git
$ cd urban-bot-starter
$ npm i
```
Rename `.env.example` to `.env`

### Telegram
 1. Get telegram [token](https://core.telegram.org/bots#6-botfather)
 2. Paste token to `.env` `TELEGRAM_TOKEN=YOUR_TOKEN`
 3. Uncomment `// import './render/telegram';` inside `src/index.ts` 
 4. Run `npm run dev` and check your bot

### Slack

 1. Create [slack app](https://slack.com/intl/en-ru/help/articles/115005265703-Create-a-bot-for-your-workspace)
 2.  Paste [token](https://api.slack.com/authentication/token-types#granular_bot) to `.env` `SLACK_TOKEN=YOUR_TOKEN` 
 3. Paste [signing secret](https://api.slack.com/authentication/verifying-requests-from-slack#about) to `.env` `SLACK_SIGNING_SECRET=YOUR_SIGNING_SECRET`
 4. Uncomment `// import './render/slack';` inside `src/index.ts` `
 5. Run `npm run dev` and check your bot
 
 ###
 Feedback:
 + Should be add error if you add element Text to Image's title. 

