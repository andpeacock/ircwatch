var redis= require('redis');
var url= require('url');
var redisURL= url.parse(process.env.REDISCLOUD_URL);
var client= redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
client.auth(redisURL.auth.split(":")[1]);

console.log("this called");
client.set('foo', 'bar');
client.get('foo', function (err, reply) {
  console.log(reply.toString()); // Will print `bar`
});
client.lpush('testlist', 'hello');
client.lindex('testlist', 0, function (err, reply) {
  if(err) return console.log(err);
  console.log(reply);
});