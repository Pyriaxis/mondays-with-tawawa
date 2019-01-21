# mondays-with-tawawa
Telegram bot in NodeJS to serve Getsuyoubi no Tawawa. (月曜日のたわわ)

Simple Bot written in NodeJS to scrape Strangestone's Tweets and get the latest Getsuyoubi no Tawawa and deliver them to subscribed telegram groups.

Rewriting with Telegraf and ES6 practices, including testing.

To use, build the image with Docker.

`docker build . -t tawawa`

Then run it with docker, mounting a directory with an empty subscribers file in it.

```
mkdir /home/ubuntu/tawawa
touch /home/ubuntu/tawawa/subscribers
docker run -d --name tawawa --volume=/home/ubuntu/tawawa:/usr/src/app/tawawa: tawawa
```
