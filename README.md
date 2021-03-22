<p align="center">
  <a href="#about">About</a>
  •
  <a href="#installation">Installation</a>
</p>

## About

The **Order Alert Bot SQLite** listens to [FTX](https://ftx.com) orders via [websockets](https://docs.ftx.com/#websocket-api) using [NestJS](https://nestjs.com/).
For each order you will receive a notification in [Telegram](https://telegram.org/) and the orders will be saved in a SQLite database.

## Installation

> ⚠️ Best to run the bot on a VPS. I can recommend [Hetzner](https://hetzner.cloud/?ref=lDD7z7LALHNr).

1. Install [NodeJS](https://nodejs.org/en/download/)
1. Clone this repository `git clone https://github.com/raftheunis87/order-alert-bot-sqlite`
1. Install all requirements `npm install`
1. Rename `.env.example` to `.env` and replace the <> placeholders with the correct values:
   - `APP_PORT` is the port on which you want the application to run
   - `TELEGRAM_BOT_TOKEN` is the token you receive after creating a bot with the BotFather
   - `TELEGRAM_CHAT_ID` is the id of the telegram group or channel in which the bot will give the order alerts
   - `FTX_ACCOUNT` is an object in which you can configure your FTX subaccount. The following keys need to be present:
     - key: the apiKey from FTX (You can/should use a read-only api key)
     - secret: the secret from FTX (You can/should use a read-only api key)
     - subaccount: the name of the subaccount
1. Run the bot `npm run build && npm run start:prod`

## How can I help?

All kinds of contributions are welcome 🙌! The most basic way to show your support is to `⭐️ star` the project, or raise [`🐞 issues`](https://github.com/raftheunis87/order-alert-bot/issues/new). You can also buy me some [☕️ coffee](https://www.buymeacoffee.com/rt87) to help keep me productive! You can also sent me some crypto to the following addresses:

- BTC: 3P4eit3YxdokJZNNEF9s6VosG9zAxhj4pS
- ETH: 0xa3Fe3CDa5cD73022F1935b342dc57FD8C6C34F56
- USDT (TRC20): THV4oP8LAt7cijNjzccfbFu8KxqdqWS8Ns

Thanks again for your support, it is much appreciated! 🙏
