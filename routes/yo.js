var request= require('request');
function Yo(user, api) {
  this.api= process.env.YOKEY,//could change to `api` to allow better use
  this.postYoUrl= "https://api.justyo.co/yo/",
  this.postYoAllUrl= "https://api.justyo.co/yoall/",
  this.postAccountUrl= "https://api.justyo.co/accounts/",
  this.getCheckUserUrl= "https://api.justyo.co/check_username/",
  this.getSubCountUrl= "https://api.justyo.co/subscribers_count/",
  this.username= process.env.YONAME//could change this to `user`
}
Yo.prototype.postYo = function(link, cb) {
  var ropts= {
    "url": this.postYoUrl,
    "body": {
      "username": this.username,
      "api_token": this.api,
      "link": link
    },
    "json": true
  };
  request.post(ropts, function (err, response, body) {
    if(err) return console.log(err);
    return cb(body);
  });
};
Yo.prototype.postAll = function(link, cb) {
  var ropts= {
    "url": this.postYoAllUrl,
    "body": {
      "username": this.username,
      "api_token": this.api,
      "link": link
    },
    "json": true
  };
  request.post(ropts, function (err, response, body) {
    if(err) return console.log(err);
    return cb(body);
  });
};
Yo.prototype.postAccounts = function(user, pass, cburl, email, desc, locbool) {
  // will do something with this if needed
};
Yo.prototype.checkUser = function(user, cb) {
  var ropts= {
    "url": this.getCheckUserUrl,
    "body": {
      "username": this.username,
      "api_token": this.api
    },
    "json": true
  };
  request.get(ropts, function (err, response, body) {
    if(err) return console.log(err);
    return cb(body);
  });
};
Yo.prototype.subscriberCount = function(cb) {
  var ropts= {
    "url": this.getSubCountUrl,
    "body": {
      "api_token": this.api
    },
    "json": true
  };
  request.get(ropts, function (err, response, body) {
    if(err) return console.log(err);
    return cb(body);
  });
};
module.exports= new Yo();
//module.exports = function (user, apikey) { return new Yo(user, apikey) };