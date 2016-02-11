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
  return db.imgur.find({}, {order: "id asc"}, function(err, results) {
    if(err){
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }
    return cb(results);
  });
}

module.exports= router;
module.exports.saveLink= saveLink;
module.exports.allLinks= allLinks;