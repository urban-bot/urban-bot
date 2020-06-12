# Telegram Proxy Tor

An example of how to bypass a blocking of an internet provider for Telegram.

1. Download [Tor browser](https://www.torproject.org/download/).
2. Enable Tor browser.
3. Install [socks5-https-client](https://www.npmjs.com/package/socks5-https-client). 
  `npm i socks5-https-client --save`
4. Add to code:
```javascript
// ...
import Agent from 'socks5-https-client/lib/Agent';

const urbanBotTelegram = new UrbanBotTelegram({
    // ...
    request: {
        agentClass: Agent,
        agentOptions: {
            socksHost: '127.0.0.1',
            socksPort: '9150',
        },
    },
});

// ...
```
