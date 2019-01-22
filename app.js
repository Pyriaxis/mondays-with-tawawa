require('dotenv').config();
const Telegraf = require('telegraf');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const util = require('util');

const TawawaTwitter = require('./util/twitter.js');
const TawawaFirebase = require('./util/firebase');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.telegram.getMe().then((botInfo) => {
    bot.options.username = botInfo.username
});

let tawawaTwitter = new TawawaTwitter();
let tawawaFirebase = new TawawaFirebase();

let CronJob = require('cron').CronJob;

new CronJob('0 55 8 * * 1', function() {
    console.log("Cron Update Fired!");
    searchAndSend();
},null,true,'Asia/Singapore');

function searchAndSend(){
    console.log('Search and Send!');
    tawawaTwitter.client.get('search/tweets', {q: '月曜日のたわわ from:Strangestone to:Strangestone'})
    .then(function(response){
        var subscribers = fs.readFileSync(path.join(__dirname + '/tawawa', 'subscribers'), 'utf8').split([' ']);
        for (var i = 0; i < subscribers.length - 1; i++){
            bot.sendMessage(subscribers[i], response.statuses[0].text);
        }
    });
}



/************************************
 *         BOT COMMANDS
 ************************************/

bot.use((ctx, next) => {
    console.log(ctx.message);
    return next();
});


bot.start((ctx) => {
    ctx.reply('Hi there! I\'m the WebComic bot (Tawawa Branch)! ' +
        'I deliver weekly editions of Getsuyoubi no Tawawa automatically!' +
        '\n\nYou can interact with me by sending me these commands:' +
        '\n\n/help - Display this message.' +
        '\n/latest comic - Get the latest Tawawa comic.' +
        '\n/subscribe - Get an automated update every Monday!')
});

bot.command('/subscribe', async (ctx)=>{
    let isSubscribed = await tawawaFirebase.getSubscriber(ctx.chat.id);
    if (isSubscribed) return ctx.reply('This chat is already subscribed!');

    tawawaFirebase.subscribe(ctx.chat);

    if (ctx.chat.type === 'group'){
        return ctx.replyWithMarkdown(`*${ctx.chat.title}* is now subscribed to \`Tawawa on Mondays\`!`);
    } else {
        return ctx.replyWithMarkdown(`You are now subscribed to \`Tawawa on Mondays\`!`);
    }
});

bot.command('/unsubscribe', async (ctx)=>{
    let isSubscribed = await tawawaFirebase.getSubscriber(ctx.chat.id);
    console.log(isSubscribed);
    if (!isSubscribed) return ctx.replyWithMarkdown(`This chat is not currently subscribed to \`Tawawa on Mondays\`.`);

    tawawaFirebase.unsubscribe(ctx.chat);

    if (ctx.chat.type === 'group'){
        return ctx.replyWithMarkdown(`*${ctx.chat.title}* is now unsubscribed from \`Tawawa on Mondays\`.`);
    } else {
        return ctx.replyWithMarkdown(`You are now unsubscribed from \`Tawawa on Mondays\`.`);
    }
});

// bot.on('/unsubscribe', function(msg) {
//     var chatId = msg.chat.id;
//     var chatTitle = msg.chat.title || "";
//
//     var comicname = msg.text.split('/unsubscribe ')[1];
//     if (repos.hasOwnProperty(comicname)){
//         return unsubscribe(chatId, chatTitle, comicname)
//     } else {
//         return bot.sendMessage(chatId, 'Sorry, you have specified an invalid webcomic. Use /list to see a list of supported webcomics.');
//     }
// });

bot.command('/debug', (ctx)=>{
    console.log(ctx.message);
    ctx.reply("Debug: ID of chat = " + ctx.chat.id.toString());
})

bot.help((ctx)=>{
    return ctx.reply('Hi there! I\'m the WebComic bot (Tawawa Branch)! ' +
        'I deliver weekly editions of Getsuyoubi no Tawawa automatically!' +
        '\n\nYou can interact with me by sending me these commands:' +
        '\n\n/help - Display this message.' +
        '\n/latest comic - Get the latest Tawawa comic.' +
        '\n/subscribe - Get an automated update every Monday!')
});


bot.command('/latest', async (ctx)=>{
    let postArray = await tawawaTwitter.smallFetch();

    await tawawaFirebase.populate(postArray);
    let latestPost = await tawawaFirebase.getLatest();

    ctx.reply(latestPost.full);
});
//
// bot.on('/broadcast', function(msg){
//     searchAndSend();
// });

bot.launch();