const Promise = require('bluebird');
const Telegram = require('telegraf/telegram');
const telegram = new Telegram(process.env.TELEGRAM_TOKEN);
const TawawaFirebase = require('./util/firebase');
const TawawaTwitter = require('./util/twitter');

let tawawaTwitter = new TawawaTwitter();
let tawawaFirebase = new TawawaFirebase();

async function getLatestAndSend(){
    let day = (new Date()).getDay();
    if (day !== 1) return; //not monday

    let oldLatest = await tawawaFirebase.getLatest();
    let postArray = await tawawaTwitter.smallFetch();

    await tawawaFirebase.populate(postArray);
    let latestPost = await tawawaFirebase.getLatest();
    let subscribers = await tawawaFirebase.getSubscribers();

    let toSend = oldLatest.full === latestPost.full ? 'Looks like Strangestone hasn\'t updated his Twitter today! Check later using the /latest command!' : latestPost.full;

    let values = Object.values(subscribers);
    let subscriberPromises = [];

    values.forEach(subscriber => {
        console.log(subscriber.id);
        console.log(toSend);
        subscriberPromises.push(telegram.sendMessage(subscriber.id, toSend));
    });

    await Promise.all(subscriberPromises);
}

getLatestAndSend().then(()=>{
    console.log('finished');
    process.exit(0);
}).catch(e => {
    console.log('finished with error');
    process.exit(0);
});