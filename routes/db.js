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
function clearList(list, cb) {
  console.log("IN CLEAR LIST IS THIS CALLED??");
  client.del('zulu', function (err, reply) {
    console.log(reply);
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
    client.send_command("lrange", [list[i], "0", "50"], function (err, reply) {
      if(err) return console.log(err);
      retList.push(reply);
      if(retList.length== list.length)
        return cb(retList);
    });
  }
}
function getTodo(cb) {
  var todos= [];
  client.hgetall("Todo", function (err, objs) {
    if(err) return console.log(err);
    for(var k in objs) {
      var newTodo = {
        text: objs[k]
      };
      todos.push(newTodo);
    }
    return cb(todos);
  });
}
function saveTodo(todo, cb) {
  var newTodo = {};
  newTodo.name = todo;
  newTodo.id = newTodo.name.replace(" ", "-");
  client.hset("Todo", newTodo.id, newTodo.name, function (err, reply) {
    if(err) return console.log(err);
    return cb(reply);
  });
}
function removeTodo(todo, cb) {
  var dt= todo.replace(" ", "-");
  client.hdel("Todo", dt, function (err, reply) {
    if(err) return console.log(err);
    return cb(reply);
  });
}
module.exports.lpush= lpush;
module.exports.get50= get50;
module.exports.getMultiList= getMultiList;
module.exports.clearList= clearList;
module.exports.getTodo= getTodo;
module.exports.saveTodo= saveTodo;
module.exports.removeTodo= removeTodo;