---
id: intro
title: Getting Started
sidebar_label: Intro
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

After downloading your new app will be inside `my-app` directory.

Now we need to set up specific messengers.
