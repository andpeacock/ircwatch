var request= require('request');
var yoapi= "49fcd110-4652-4067-8546-fc04e15f0d21";
function postYo(link) {
  var ropts= {
    "url": "https://api.justyo.co/yo/",
    "body": {
      "username": "skooljester",
      "api_token": yoapi,
      "link": link
    },
    "json": true
  };
  request.post(ropts, function (err, response, body) {
    if(err) return console.log(err);
    return;
  });
}

module.exports.postYo= postYo;