require('dotenv').config();
const Telegraf = require('telegraf');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const util = require('util');

const TawawaTwitter = require('./util/twitter.js');
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.telegram.getMe().then((botInfo) => {
    bot.options.username = botInfo.username
});

let tawawaTwitter = new TawawaTwitter();

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

function subscribe(cid, chattitle){
    var subscribers = fs.readFileSync(path.join(__dirname + '/tawawa', 'subscribers'), 'utf8').split([' ']);
    console.log(subscribers);
    console.log(cid.toString());

    if (subscribers.indexOf(cid.toString()) == -1){
        fs.appendFileSync(path.join(__dirname + '/tawawa', 'subscribers'), cid + ' ');
        if (chattitle === "")
        {
            return bot.sendMessage(cid, 'You have successfully subscribed to Getsuyoubi no Tawawa');
        }
        else {
            return bot.sendMessage(cid, chattitle + " has been subscribed to Getsuyoubi no Tawawa");
        }
    } else {
        return bot.sendMessage(cid, 'Already subscribed.');
    }
}

// function unsubscribe(cid, chattitle){
//     subscribers.findOneAndUpdate({key: comicname},{$pull: {subscribers: cid}}, {upsert: true}, function(err,doc){
//         if (err) {
//             console.log(err);
//             return bot.sendMessage(cid, 'DB Error!');
//         } else {
//             if (chattitle === "")
//             {
//                 return bot.sendMessage(cid, 'You have successfully unsubscribed from the webcomic ' + comicname +'!');
//             }
//             else{
//                 return bot.sendMessage(cid, chattitle + " has been unsubscribed from the webcomic " + comicname + '!');
//             }
//         }
//     });
// }

/************************************
 *         BOT COMMANDS
 ************************************/

bot.use((ctx, next) => {
    console.log(ctx.message)
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

bot.command('/subscribe', (ctx)=>{
    var chatId = msg.chat.id;
    var chatTitle = msg.chat.title || "";

    return subscribe(chatId, chatTitle)
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
    ctx.reply((await tawawaTwitter.latest).text);
    //tawawaTwitter.client.get('tweets/search/fullarchive/dev', {
    //    query: '月曜日のたわわ from:Strangestone to:Strangestone'
    //})
});
//
// bot.on('/broadcast', function(msg){
//     searchAndSend();
// });

bot.launch();