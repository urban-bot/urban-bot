// Initialize using signing secret from environment variables
const { createEventAdapter } = require('@slack/events-api');
// const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
const { WebClient } = require('@slack/web-api');
const slackEvents = createEventAdapter('6f28eeba42717acfb2249c78e6a4b190');
const port = 8080;

// const token = process.env.SLACK_TOKEN;
const token = 'xoxb-1067397452132-1061285523475-FYuXpydlFDZnhKHRghGKbg18';

const web = new WebClient(token);

// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im

function handleMessage(event) {
    console.log(event);
    if (event.bot_id === undefined) {
        web.chat.postMessage({ channel: event.channel, text: event.text }).catch(console.log);
    }
}
slackEvents.on('message', handleMessage);

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

// Start a basic HTTP server
slackEvents.start(port).then(() => {
    // Listening on path '/slack/events' by default
    console.log(`server listening on port ${port}`);
});
