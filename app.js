var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var request= require('request');
var pastebin= require('pastebin')('ff89e92a9a25f6febb3c6b798c20a4a6');
var imgur= require('imgur');

var routes = require('./routes/index');
var users = require('./routes/users');
//var irc= require('./routes/irc');

var app = express();


// var yoapi= "49fcd110-4652-4067-8546-fc04e15f0d21";
// function newPaste(cont) {
//   pastebin.new({title: 'test', content: cont, privacy: 1, expire:'1D'}, function (err, ret) {
//     if (err) return console.log(err);
//     else
//       postYo(ret);
//   });
// }
// function postYo(link) {
//   var ropts= {
//     "url": "https://api.justyo.co/yo/",
//     "body": {
//       "username": "skooljester",
//       "api_token": yoapi,
//       "link": link
//     },
//     "json": true
//   };
//   request.post(ropts, function (err, response, body) {
//     if(err) return console.log(err);
//   });
// }

// app.get('/', function(req, res) {
//   res.render('index', { title: 'Express' });
// });
// app.get('/rejoin', function (req, res) {
//   client.join('#zulu');
//   res.send("Done");
// });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
