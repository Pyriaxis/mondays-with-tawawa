const firebase = require('firebase-admin');
const serviceAccount = require('../firebase_tawawa');

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
