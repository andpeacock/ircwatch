var redis= require('redis');
var url= require('url');
var redisURL= url.parse(process.env.REDISCLOUD_URL);
var client= redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
client.auth(redisURL.auth.split(":")[1]);

console.log("this called");
// client.set('foo', 'bar');
// client.get('foo', function (err, reply) {
//   console.log(reply.toString()); // Will print `bar`
// });
// client.lpush('testlist', 'hello');
// client.send_command("lpush", ["testlist", "hello"], function (rep) {
//   console.log("in top cb");
//   client.send_command("lindex", ["testlist", 0], function (err, reply) {
//     console.log("in second cb");
//     if(err) return console.log(err);
//     console.log(reply);
//   });
// });

function lpush(list, item, cb) {
  console.log("in lpush");
  client.send_command("lpush", [list, item], function (err, reply) {
    if(err) return console.log(err);
    return cb(reply);
  });
}
function get50(list) {
  console.log("in get50");
  client.send_command("lrange", [list, "0", "50"], function (err, reply) {
    if(err) return console.log(err);
    return reply;
  });
}

module.exports.lpush= lpush;
module.exports.get50= get50;