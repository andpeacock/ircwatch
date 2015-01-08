var irc= require('irc');
var yo= require('./yo');
var pb= require('./pastebin');

var client = new irc.Client('irc.zulusquad.org', 'FUCKBITCHESGETMONEY', {
  channels: ['#zulu']
});
client.addListener('message', function (from, to, message) {
  if(message.match('jezza(\d+)?')) {
    var msgstr= from + ' => : ' + message;
    pb.newPaste(msgstr, yo.postYo);
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