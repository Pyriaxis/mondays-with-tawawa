const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const util = require('util');

const TawawaTwitter = require('./util/twitter.js');
const TawawaFirebase = require('./util/firebase');
const ListHandler = require('./list');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
bot.telegram.setWebhook('https://mondays-with-tawawa.herokuapp.com:8443/webhook-mon-w-tawawa');

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

ListHandler.init(bot, tawawaFirebase);

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

bot.command('/debug', (ctx)=>{
    console.log(ctx.message);
    ctx.reply("Debug: ID of chat = " + ctx.chat.id.toString());
});

bot.command(['/grab', '/fetch', '/get'], async (ctx)=>{
    let numberRegex = /(\d+)/g;
    let num = ctx.message.text.match(numberRegex);

    if (num !== null){
        let postsArray = await tawawaFirebase.getPostsAtIndex(num[0]);
        if (postsArray.length === 0){
            ctx.reply(`Sorry, comic no. ${num[0]} not found in the database. It may not have been archived yet.`);
        } else {
            ctx.reply(postsArray[0].full);
        }
    } else {
        ctx.replyWithMarkdown(`*/grab, /fetch, /get <number>* to display a specific Tawawa comic.`);
    }
});

bot.help((ctx)=>{
    return ctx.reply('Hi there! I\'m the WebComic bot (Tawawa Branch)! ' +
        'I deliver weekly editions of Getsuyoubi no Tawawa automatically!' +
        '\n\nYou can interact with me by sending me these commands:' +
        '\n\n/help - Display this message.' +
        '\n/latest comic - Get the latest Tawawa comic.' +
        '\n/subscribe - Get an automated update every Monday!')
});

bot.command('/largefetch', async (ctx)=>{
    let postArray = await tawawaTwitter.largeFetch();
    await tawawaFirebase.populate(postArray);
});

bot.command('/latest', async (ctx)=>{
    let postArray = await tawawaTwitter.smallFetch();

    await tawawaFirebase.populate(postArray);
    let latestPost = await tawawaFirebase.getLatest();

    ctx.reply(latestPost.full);
});

bot.startWebhook('/webhook-mon-w-tawawa', null, 5000);
//bot.launch();