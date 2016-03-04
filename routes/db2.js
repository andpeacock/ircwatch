var express = require('express');
var router = express.Router();
var massive = require("massive");
var connectionString = process.env.DATABASE_URL;
var db = massive.connectSync({connectionString : connectionString});

function saveLink(ulink, cb) {
  db.imgur.saveDoc({link : ulink}, function(err,doc){
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

var newDoc = {
  text : "https://github.com/robconery/massive-js",
  link: false
};

db.saveDoc("todo", newDoc, function(err,res){
  //the table my_documents was created on the fly
  //res is the new document with an ID created for you
  if(err)
    return console.log(err);
  return console.log("worked");
});

module.exports= router;
module.exports.saveLink= saveLink;
module.exports.allLinks= allLinks;
module.exports.removeLink= removeLink;