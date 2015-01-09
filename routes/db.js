var redis= require('redis');
var url= require('url');
var redisURL= url.parse(process.env.REDISCLOUD_URL);
var client= redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
client.auth(redisURL.auth.split(":")[1]);

function lpush(list, item, cb) {
  client.send_command("lpush", [list, item], function (err, reply) {
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

module.exports.lpush= lpush;
module.exports.get50= get50;