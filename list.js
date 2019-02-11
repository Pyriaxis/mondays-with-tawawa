const TawawaFirebase = require('./util/firebase');
const Markup = require('telegraf/markup');
const jpUtil = require('./util/jpUtil');

const wrapMarkup = {columns: 1, wrap: (btn, index, currentRow) => index < 6};

const ListHandler = {
    tawawaFirebase: undefined,
    bot: undefined,

    init: function(bot, firebase){
        this.bot = bot;
        this.tawawaFirebase = firebase;

        bot.command('/list', async (ctx)=>{
            await this.updateIndexes();
            let markupArray = await this.generateMarkupArray(this.latest, 5);

            ctx.reply('Select a comic from the list:',
                Markup.inlineKeyboard(markupArray, wrapMarkup).extra()
            );
        });

        bot.action(/l(\d+)/, async (ctx)=> {
            ctx.answerCbQuery();
            let markupArray = await this.generateMarkupArray(parseInt(ctx.match[1]), 5);
            ctx.editMessageReplyMarkup(Markup.inlineKeyboard(markupArray, wrapMarkup));
        });

        bot.action(/\d+/, async (ctx)=>{
            ctx.answerCbQuery();
            let postArray = await this.tawawaFirebase.getPostsAtIndex(ctx.match[0]);
            ctx.reply(postArray[0].full);
        })
    },

    updateIndexes: async function(){
        let latestPost = await this.tawawaFirebase.getLatest();
        this.latest = latestPost.number;
        let oldestPost = await this.tawawaFirebase.getEarliest();
        this.oldest = oldestPost.number;
    },

    latest: 200,
    oldest: 157,

    generateMarkupArray: async function(index, num){
        let postArray = await this.tawawaFirebase.getPostsAtIndex(index, num);
        postArray = postArray.reverse();

        let markupArray = postArray.map(post =>{
            return Markup.callbackButton(`その${jpUtil.convertIntToJp(post.number)} 『${post.title}』`, post.number.toString());
        });

        if (index-5 > this.oldest){
            markupArray.push(Markup.callbackButton('<<', `l${index-5 > this.oldest ? index-5 : this.oldest}`));
        }

        if (index < this.latest){
            markupArray.push(Markup.callbackButton('>>', `l${index+5 < this.latest ? index+5 : this.latest}`));
        }

        return markupArray;
    }
};


module.exports = ListHandler;

