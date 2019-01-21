var http = require('http');
var https = require('https');
const _ = require('lodash');
const Twitter = require('twitter');
const util = require('util');

const fs = require('fs');
const path = require('path');

var options = {
    host: 'www.explosm.net',
    path: '/comics/4507'
};

// const client = new Twitter({
//     consumer_key: '',
//     consumer_secret: '',
//     access_token_key: '',
//     access_token_secret: ''
// })

// client.get('search/tweets', {q: '月曜日のたわわ from:Strangestone to:Strangestone'})
//     .then(function(response){
//         console.log(util.inspect(response, false, null));
//     });

fs.appendFileSync(path.join(__dirname, 'test'), '12345' + ' ');
fs.appendFileSync(path.join(__dirname, 'test'), '12345' + ' ');
fs.appendFileSync(path.join(__dirname, 'test'), '12345' + ' ');

test_data = fs.readFileSync(path.join(__dirname, 'test'), 'utf8').split([' ']);

console.log(test_data);