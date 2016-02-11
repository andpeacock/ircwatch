var express= require('express');
var multer= require('multer');
var imgur= require('imgur');
var db= require('./db');
var db2= require('./db2');
var router= express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  db.getTodo(function (ret) {});
  db.getMultiList(['imgur', 'zulu'], function (rlist) {
    db.getTodo(function (todoRet) {
      console.log("above db2.allLinks");
      console.log(db2.allLinks());
      res.render('index', {
        title: 'Random Shit',
        linkList: rlist[0],
        zuluList: rlist[1],
        todo: todoRet
      });
    });
  });
});

router.get('/rejoin', function (req, res) {
  db.clearList('zulu', function(){
    res.send("Done");
  });
});

function addPhotoList(link, cb) {
  db.lpush('imgur', link, function (reply) {
    cb();
  });
}
//Handling for photo uploads
router.use('/photo', multer({ dest: './uploads/',
  rename: function (fieldname, filename) {
    return filename+Date.now();
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function (file) {
    imgur.uploadFile(file.path).then(function (json) {
      addPhotoList(json.data.link, function() {
        return;
      });
    }).catch(function (err) {
      console.error(err.message);
    });
  }
}));
router.post('/photo', function (req, res){
  res.redirect('/');
});
router.post('/link', function (req, res) {
  imgur.uploadUrl(req.body.photoLink).then(function (json) {
    addPhotoList(json.data.link, function() {
      return res.redirect('/');
    });
  }).catch(function (err) {
    console.error(err.message);
  });
});
router.post('/todo', function (req, res) {
  db.saveTodo(req.body.newTodo, function (reply) {
    res.redirect('/');
  });
});
router.post('/todoDel', function (req, res) {
  console.log(req.body.todoText);
  db.removeTodo(req.body.todoText, function (reply) {
    res.redirect('/');
  });
});

module.exports = router;