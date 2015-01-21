var irc= require('irc');
var yo= require('./yo');
var pb= require('./pastebin');
var db= require('./db');
var moment= require('moment');

var client = new irc.Client('irc.zulusquad.org', 'FUCKBITCHESGETMONEY', {
  channels: ['#zulu']
});
client.addListener('message', function (from, to, message) {
  if(message.match('jezza(\d+)?')) {
    var msgstr= '('+moment().format('MM/DD/YYYY HH:mm:ss')+'): '+from + ' => : ' + message;
    pb.newPaste(msgstr, function (link) {
      yo.postYo(link, function() {return;});
    });
    db.lpush('zulu', msgstr, function (reply) {
      console.log("worked?");
      console.log(reply);
    });
  }
});
client.addListener('error', function(message) {//Rejoin if error
  console.log('error: '+ message);
  chanJoin('zulu');
});
client.addListener('part', function(channel, who, reason) {//Rejoin if bot leaves for some reason
  console.log('%s has left %s: %s', who, channel, reason);
  chanJoin('zulu');
});
function chanJoin(chan) {
  return client.join('#'+chan);
}

function ircWatch() {
  this.client= new irc.Client('irc.zulusquad.org', 'FUCKBITCHESGETMONEY', {
    channels: ['#zulu']
  }),
  this.userWatch= ["jezza"],
  this.addListener('message', function (from, to, message) {
    this.userSubscribe(from, to, message);
    this.userMatch(from, to, message)
  });
}
ircWatch.prototype.userSubscribe = function(from, to, message) {
  if(message.match('\!subscribe'))
    this.userWatch.push(from);
};
ircWatch.prototype.userMatch = function(from, to, message) {
  for(var i= 0; i< this.userWatch.length; i++) {
    var rg= new RegExp(this.userWatch[i]+ "(\d+)?");
    if(message.match(rg)) {
      var msgstr= '('+moment().format('MM/DD/YYYY HH:mm:ss')+'): '+from + ' => : ' + message;
      pb.newPaste(msgstr, yo.postYo);
    }
  }
};

module.exports.chanJoin= chanJoin;
module.exports.ircClient= client;