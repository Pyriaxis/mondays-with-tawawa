const Twitter = require('twitter-lite');
const jpUtil = require('./jpUtil');

class TawawaTwitter{
    constructor(){
        this.client = new Twitter({
            subdomain: "api",
            consumer_key: process.env.TWITTER_CONS_KEY,
            consumer_secret: process.env.TWITTER_CONS_SECRET,
            access_token_key: process.env.TWITTER_ACCESS_KEY,
            access_token_secret: process.env.TWITTER_ACCESS_SECRET,
        });
    }

    static parseTwitterText(input){
        let parsed = [];
        let regex = /(月曜日のたわわ　その(\S+) [「『](.+)[』」] (https:\/\/.+)$)/gu;
        let tempMatch;
        if ((tempMatch = regex.exec(input)) !== null){
            parsed.push(tempMatch[1]);
            parsed.push(jpUtil.convertJpToInt(tempMatch[2]));
            parsed.push(tempMatch[3]);
            parsed.push(tempMatch[4])
        } else {
            throw new Error('Malformed twitter string. Ignoring.');
        }
        return parsed;
    };

    get latest(){
        return this.client.get('search/tweets', {q: '月曜日のたわわ from:Strangestone to:Strangestone'})
            .then(res =>{
                return res.statuses[0];
            })
    }
}

module.exports = TawawaTwitter;