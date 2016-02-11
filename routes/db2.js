var express = require('express');
var router = express.Router();
var massive = require("massive");
var connectionString = process.env.DATABASE_URL;
var db = massive.connectSync({connectionString : connectionString});

function saveLink(ulink) {
  db.saveDoc("imgur", {link : ulink}, function(err,doc){
    if(err)
      return console.log(err);
    console.log(doc);
  });
}

module.exports= router;
module.exports.saveLink= saveLink;