var irc= require('irc');
var yo= require('./yo');
var pb= require('./pastebin');
var db= require('./db');
var moment= require('moment');

var client = new irc.Client('irc.zulusquad.org', 'zzzzz', {
  channels: ['#zulu']
});
// client.addListener('message', function (from, to, message) {
//   if(message.match(/jezza(\d+)?/i)) {
//     var msgstr= '('+moment().format('MM/DD/YYYY HH:mm:ss')+'): '+from + ' => : ' + message;
//     pb.newPaste(msgstr, function (link) {
//       yo.postYo(link, function() {return;});
//     });
//     db.lpush('zulu', msgstr, function (reply) {
//       console.log("worked?");
//       console.log(reply);
//     });
//   }
// });
client.addListener('message', matchCheck);
client.addListener('error', function(message) {//Rejoin if error
  console.log('error: '+ message);
  client.join("#zulu");
  //chanJoin('zulu');
});
client.addListener('part', function(channel, who, reason) {//Rejoin if bot leaves for some reason
  console.log('%s has left %s: %s', who, channel, reason);
  client.join("#zulu");
  //chanJoin('zulu');
});
function matchCheck(from, to, message) {
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
}
function chanJoin(chan) {
  return client.join('#'+chan, function() {
    client.addListener('message', matchCheck);
  });
}

// function ircWatch() {
//   this.client= new irc.Client('irc.zulusquad.org', 'FUCKBITCHESGETMONEY', {
//     channels: ['#zulu']
//   }),
//   this.userWatch= ["jezza"];
//   this.messageListen();
// }
// ircWatch.prototype.messageListen = function() {
//   this.client.addListener('message', function (from, to, message) {
//     this.userSubscribe(from, to, message);
//     this.userMatch(from, to, message)
//   });
// };
// ircWatch.prototype.userSubscribe = function(from, to, message) {
//   if(message.match('\!subscribe'))
//     this.userWatch.push(from);
// };
// ircWatch.prototype.listEcho = function(from, message) {
//   var self= this;
//   if(message.match('\!echo'))
//     this.client.say('#zulu', self.userWatch.join(', '));
// };
// ircWatch.prototype.userMatch = function(from, to, message) {
//   for(var i= 0; i< this.userWatch.length; i++) {
//     var rg= new RegExp(this.userWatch[i]+ "(\d+)?");
//     if(message.match(rg)) {
//       var msgstr= '('+moment().format('MM/DD/YYYY HH:mm:ss')+'): '+from + ' => : ' + message;
//       pb.newPaste(msgstr, yo.postYo);
//     }
//   }
// };

module.exports.chanJoin= chanJoin;
module.exports.ircClient= client;