var express= require('express');
var multer= require('multer');
var imgur= require('imgur');
var db= require('./db');
var db2= require('./db2');
var router= express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  db.getMultiList(['zulu'], function (rlist) {
    db.getTodo(function (todoRet) {
      db2.allLinks(function(llist) {
        res.render('index2', {
          title: 'Hub',
          linkList: llist,
          zuluList: rlist[0],
          todo: todoRet
        });
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
  db2.saveLink(link, function(doc) {
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
router.post('/photo', function (req, res) {
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
router.post('/imgDel', function(req, res) {
  db2.removeLink(req.body.imgid, function(reply) {
    return res.redirect('/');
  });
});
router.post('/todo', function (req, res) {
  db.saveTodo(req.body.newTodo, function (reply) {
    return res.redirect('/');
  });
});
router.post('/todoDel', function (req, res) {
  console.log(req.body.todoText);
  db.removeTodo(req.body.todoText, function (reply) {
    return res.redirect('/');
  });
});

module.exports = router;