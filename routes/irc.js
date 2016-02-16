var irc= require('irc');
var yo= require('./yo');
var pb= require('./pastebin');
var db= require('./db');
var moment= require('moment');

var chanurl= process.env.CHANURL;
var chan= process.env.CHAN;
var name= process.env.IRCNAME;

var client = new irc.Client(chanurl, 'zzzzz', {
  channels: [chan]
});
client.addListener('message', matchCheck);
client.addListener('error', function(message) {//Rejoin if error
  console.log('error: '+ message);
  client.join(chan);
});
client.addListener('part', function(channel, who, reason) {//Rejoin if bot leaves for some reason
  console.log('%s has left %s: %s', who, channel, reason);
  client.join(chan);
});
function matchCheck(from, to, message) {
  if(message.match(name+'(\d+)?')) {
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
  return client.join(chan, function() {
    client.addListener('message', matchCheck);
  });
}

module.exports.chanJoin= chanJoin;
module.exports.ircClient= client;