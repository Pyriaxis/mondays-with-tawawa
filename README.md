# mondays-with-tawawa
Telegram bot in NodeJS to serve Getsuyoubi no Tawawa. (月曜日のたわわ)
Try it live @GnTawawaBot

Simple Bot written in NodeJS to scrape Strangestone's Tweets and get the latest Getsuyoubi no Tawawa and deliver them to subscribed telegram groups.

Rewriting with Telegraf and ES6 practices, including testing.

### Additional Requirements
Some secrets are omitted and need to be stored in a `.env` file in the root folder.
* TELEGRAM_TOKEN
* TWITTER_CONS_KEY
* TWITTER_CONS_SECRET
* TWITTER_ACCESS_KEY
* TWITTER_ACCESS_SECRET

These secrets will be read using the [dotenv](https://www.npmjs.com/package/dotenv) npm package.

In addition, a **Firebase Service Account** needs to be created, and credentials stored in `firebase_tawawa.json` in the root folder.

### Starting the server

To run, build the image with Docker, then run it.

```
$ docker build . -t tawawa
$ docker run -d --name=tawawa tawawa
```
