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
            throw new Error(`Malformed twitter string: ${input}. Ignoring.`);
        }
        return parsed;
    };

    smallFetch() {
        return this.client.get('search/tweets', {q: '月曜日のたわわ from:Strangestone to:Strangestone'})
            .then(res => {
                return res.statuses.map(post => {
                    try {
                        return TawawaTwitter.parseTwitterText(post.text);
                    } catch(e){
                        console.log(e);
                        return undefined;
                    }
                });
            })
    }

    //This scraping function should only be run once to populate firebase. Twitter search API doesnt return full results properly.
    largeFetch() {
        return [];
        // return this.client.get('tweets/search/fullarchive/dev', {
        //     query: '月曜日のたわわ from:Strangestone to:Strangestone',
        //     fromDate: 201706010000,
        //     toDate: 201802190000,
        //     maxResults: 50,
        //     next: 'eyJhdXRoZW50aWNpdHkiOiI5NThhMzU5NTI1YzUyODUxNmQ4MzEyYzYyNTAzNjNkYjljZmM5MTE2MDZlZjgxMDA1M2Y3ODQ0YjlkNmRhZWIxIiwiZnJvbURhdGUiOiIyMDE3MDYwMTAwMDAiLCJ0b0RhdGUiOiIyMDE4MTAyNzAwMDAiLCJuZXh0IjoiMjAxODAzMTkwMDIwMDAtOTczMDE4ODk3ODM3MjYwODAwLTIwMTgwMzEyMDIxMjM3In0=',
        // }).then(res => {
        //     console.log(res);
        //     return res.results.map(post => {
        //         try {
        //             return TawawaTwitter.parseTwitterText(post.text);
        //         } catch(e){
        //             console.log(e);
        //             return undefined;
        //         }
        //     });
        // })
    }
}

module.exports = TawawaTwitter;