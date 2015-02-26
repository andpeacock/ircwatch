var redis= require('redis');
var url= require('url');
var redisURL= url.parse(process.env.REDISCLOUD_URL);
var client= redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
client.auth(redisURL.auth.split(":")[1]);

client.send_command("ltrim", ["zulu", "1", "-1"], function (err, reply) {
  if(err) return console.log(err);
  return;
});

function lpush(list, item, cb) {
  client.send_command("lpush", [list, item], function (err, reply) {
    if(err) return console.log(err);
    return cb(reply);
  });
}
function clearList(list, cb) {
  client.send_command("ltrim", [list, "1", "-1"], function (err, reply) {
    if(err) return console.log(err);
    return cb(reply);
  });
}
function get50(list, cb) {
  client.send_command("lrange", [list, "0", "50"], function (err, reply) {
    if(err) return console.log(err);
    return cb(reply);
  });
}
function getMultiList(list, cb) {
  var retList= [];
  for(var i= 0; i< list.length; i++) {
    console.log(list[i]);
    client.send_command("lrange", [list[i], "0", "50"], function (err, reply) {
      if(err) return console.log(err);
      retList.push(reply);
      if(retList.length== list.length)
        return cb(retList);
    });
  }
}
module.exports.lpush= lpush;
module.exports.get50= get50;
module.exports.getMultiList= getMultiList;
module.exports.clearList= clearList;

// function DB() {
//   this.redisURL= url.parse(process.env.REDISCLOUD_URL),
//   this.client= redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true}),
//   this.client.auth(redisURL.auth.split(":")[1]);
// }
// DB.prototype.lpush = function(list, item, cb) {
//   this.client.send_command("lpush", [list, item], function (err, reply) {
//     if(err) return console.log(err);
//     return cb(reply);
//   });
// };
// DB.prototype.get50 = function(list, cb) {
//   this.client.send_command("lrange", [list, "0", "50"], function (err, reply) {
//     if(err) return console.log(err);
//     return cb(reply);
//   });
// };
// DB.prototype.getMultiList = function(list, cb) {
//   var retList= [];
//   for(var i= 0; i< list.length; i++) {
//     this.client.send_command("lrange", [list[i], "0", "50"], function (err, reply) {
//       if(err) return console.log(err);
//       retList.push(reply);
//       if(retList.length== i)
//         return cb(retList);
//     });
//   }
// };