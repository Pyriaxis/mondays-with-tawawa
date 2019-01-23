const firebase = require('firebase-admin');

const serviceAccount = {
    "type": "service_account",
    "project_id": "tawawa-telegram",
    "private_key_id": process.env.FB_PRIVATE_KEY_ID,
    "private_key": process.env.FB_PRIVATE_KEY,
    "client_email": process.env.FB_CLIENT_EMAIL,
    "client_id": process.env.FB_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": process.env.FB_CLIENT_X509_CERT_URL
};

class TawawaFirebase{
    constructor(){
        this.client = firebase.initializeApp({
            credential: firebase.credential.cert(serviceAccount),
            databaseURL: "https://tawawa-telegram.firebaseio.com",
            databaseAuthVariableOverride: {
                uid: 'tawawa-sw'
            }
        });

        this.db = firebase.database();
        this.subscribers = this.db.ref('subscribers');
        this.comics = this.db.ref('comics');
    }

    subscribe(chat){
        this.subscribers.child(chat.id).set(chat);
    };

    unsubscribe(chat){
        this.subscribers.child(chat.id).set(null);
    };

    getSubscriber(chatId){
        return this.subscribers.child(chatId).once("value").then(snap=>{
           return snap.val();
        });
    }

    /**
     * @param posts
     * post - [ full text, number, title, url ]
     */

    populate(posts){
        posts.forEach(post =>{
            if (post) this.comics.child(post[1]).set({
                full: post[0],
                number: post[1],
                title: post[2],
                url: post[3],
            });
        })
    }

    getLatest(){
        return this.comics.orderByKey().limitToLast(1).once("value").then(snaps =>{
            let retObj = {};
            snaps.forEach(function(snap) {
                retObj = snap.val();
                return true;
            });
            return retObj;
        })
    };

    getEarliest(){
        return this.comics.orderByKey().limitToFirst(1).once("value").then(snaps =>{
            let retObj = {};
            snaps.forEach(function(snap) {
                retObj = snap.val();
                return true;
            });
            return retObj;
        })
    };

    getPostsAtIndex(index, numPosts = 1){
        index = index.toString();
        return this.comics.orderByKey().endAt(index).limitToLast(numPosts).once("value").then(snaps =>{
            let retArray = [];
            let retObj = {};
            snaps.forEach(function(snap) {
                retObj = snap.val();
                retArray.push(retObj);
            });
            return retArray;
        })
    }
}

module.exports = TawawaFirebase;
