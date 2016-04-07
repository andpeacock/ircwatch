var express= require('express');
var multer= require('multer');
var imgur= require('imgur');
var db= require('./db');
var db2= require('./db2');
var router= express.Router();
//var encount= 0;

/* GET home page. */
router.get('/', function (req, res) {
  db.getMultiList(['zulu'], function (rlist) {
    db2.allTodos(function (todoRet) {
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

// router.post('/encount', function(req, res) {
//   encount= req.body.count;
//   console.log("got post");
//   res.send("post received");
// });

//PHOTO STUFF
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
        return res.redirect('/');
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
//TODO Stuff
router.post('/todo', function (req, res) {
  //req.body.newTodo.match(/^(http(s)?\:\/\/).+/) ? true : false
  db2.saveTodo(req.body.newTodo, (req.body.newTodo.match(/^(http(s)?\:\/\/).+/) ? true : false), function(reply) {
    return res.redirect('/');
  });
});
router.post('/todoDel', function (req, res) {
  db2.removeTodo(req.body.id, function (reply) {
    return res.redirect('/');
  });
});
//FISH STUFF
router.post('/fish', function(req, res) {
  console.log(req.body);
  //db2.fish.saveFish()
});
router.get('/fish', function(req, res) {

});

module.exports = router;