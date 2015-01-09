var irc= require('irc');
var yo= require('./yo');
var pb= require('./pastebin');
var db= require('./db');

var client = new irc.Client('irc.zulusquad.org', 'FUCKBITCHESGETMONEY', {
  channels: ['#zulu']
});
client.addListener('message', function (from, to, message) {
  if(message.match('jezza(\d+)?')) {
    var msgstr= from + ' => : ' + message;
    pb.newPaste(msgstr, yo.postYo);
    db.lpush('zulu', msgstr, function(reply) {
      console.log("worked?");
      console.log(reply);
    });
  }
});
client.addListener('error', function(message) {
  console.log('error: ', message);
});
function chanJoin(chan) {
  return client.join('#'+chan);
}
module.exports.chanJoin= chanJoin;
module.exports.ircClient= client;