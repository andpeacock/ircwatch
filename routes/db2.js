var express = require('express');
var router = express.Router();
var massive = require("massive");
var connectionString = process.env.DATABASE_URL;
var db = massive.connectSync({connectionString : connectionString});

function saveLink(ulink, cb) {
  return db.imgur.saveDoc({link : ulink}, function(err,doc){
    if(err)
      return console.log(err);
    console.log(doc);
    cb(doc);
  });
}

function allLinks(cb) {
  return db.imgur.find({}, {order: "id desc"}, function(err, results) {
    if(err){
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }
    console.log("results: ");
    console.log("results length: "+ results.length);
    return cb(results);
  });
}

function removeLink(linkid, cb) {
  return db.imgur.destroy({id: linkid}, function(err, res) {
    if(err)
      return console.log(err);
    return cb(res);
  });
}

function allTodos(cb) {
  return db.todo.find({}, {order: "id desc"}, function(err, results) {
    if(err)
      return console.log(err);
    //console.log(results);
    return cb(results);
  });
}
function saveTodo(todo, link, cb) {
  return db.todo.saveDoc({text: todo, link: link}, function(err, doc) {
    if(err)
      return console.log(err);
    return cb(doc);
  });
}
function removeTodo(todoid, cb) {
  return db.todo.destroy({id: todoid}, function(err, res) {
    if(err)
      return console.log(err);
    return cb(res);
  });
}

var fish= {
  saveFish: function(data, cb) {
    /*
     * fishName 
     * fishNum 
     * fishLoc
     * fishColour
    */
    var newFish = {
      name : data.fishName,
      num : parseInt(data.fishNum),
      loc : data.fishLoc,
      colour: data.fishColour
    };
    return db.fish.saveDoc(newFish, function(err, doc) {
      if(err)
        return console.log(err);
      return cb(doc);
    });
  },
  findLoc: function(spot, cb) {
    return db.fish.find({loc: spot}, function(err, results) {
      if(err)
        return console.log(err);
      return cb(results);
    });
  },
  getLocList: function(cb) {
    db.run("select distinct loc from fish", function(err, results){
      if(err)
        return console.log(err);
      return cb(results);
    });
  }
};
//This is actually a horrible way to do this just make it in postico
/*
var newDoc = {
  name: "Piranha",
  num: 7,
  loc: "Splash Town",
  colour: "gold"
};
db.saveDoc("fish", newDoc, function(err,res){
  //the table my_documents was created on the fly
  //res is the new document with an ID created for you
  if(err)
    return console.log(err);
  return console.log("worked");
});
*/

module.exports= router;
module.exports.saveLink= saveLink;
module.exports.allLinks= allLinks;
module.exports.removeLink= removeLink;
module.exports.allTodos= allTodos;
module.exports.saveTodo= saveTodo;
module.exports.removeTodo= removeTodo;
module.exports.fish= fish;