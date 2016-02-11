var irc= require('irc');
var yo= require('./yo');
var pb= require('./pastebin');
var db= require('./db');
var moment= require('moment');

var client = new irc.Client('irc.hello.org', 'zzzzz', {
  channels: ['#hello']
});
client.addListener('message', matchCheck);
client.addListener('error', function(message) {//Rejoin if error
  console.log('error: '+ message);
  client.join("#hello");
});
client.addListener('part', function(channel, who, reason) {//Rejoin if bot leaves for some reason
  console.log('%s has left %s: %s', who, channel, reason);
  client.join("#hello");
});
function matchCheck(from, to, message) {
  if(message.match('andrew(\d+)?')) {
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

module.exports.chanJoin= chanJoin;
module.exports.ircClient= client;