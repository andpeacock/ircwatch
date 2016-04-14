var express= require('express');
var multer= require('multer');
var imgur= require('imgur');
var db= require('./db');
var db2= require('./db2');
var router= express.Router();
//var histogram = require('histogram'); //testing histogram for comparison -- doesn't work on Heroku by default
//var encount= 0;

var Jimp = require('jimp'); //for cropping images -- can also diff with it
//var resemble= require('resemblejs'); //for matching images

/* GET home page. */
router.get('/', function (req, res) {
  db.getMultiList(['zulu'], function (rlist) {
    db2.allTodos(function (todoRet) {
      db2.allLinks(function(llist) {
        db2.fish.getLocList(function(loclist) {
          res.render('index2', {
            title: 'Hub',
            linkList: llist,
            zuluList: rlist[0],
            todo: todoRet,
            loclist: loclist
          });
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
        next();
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
  Jimp.read(req.body.photoLink, function (err, image) {
    if(err)
      console.log(err);
    image.greyscale(function(err, image) {
      if(err)
        console.log(err)
      image.scale(0.5, function (err, image) {
        if(err)
          console.log(err);
        console.log(image);
      });
    });
  });
  // imgur.uploadUrl(req.body.photoLink).then(function (json) {
  //   addPhotoList(json.data.link, function() {
  //     return res.redirect('/');
  //   });
  // }).catch(function (err) {
  //   console.error(err.message);
  // });
});
router.post('/imgDel', function(req, res) {
  db2.removeLink(req.body.imgid, function(reply) {
    return res.redirect('/');
  });
});
//TODO Stuff
router.post('/todo', function (req, res) {
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
  db2.fish.saveFish(req.body, function(doc) {
    return res.redirect('/');
  });
});
router.get('/fish', function(req, res) {
  db2.fish.findLoc(req.query.loc, function(doc) {
    var total= 0;
    for(var i= 0; i< doc.length; i++) {
      total+= doc[i].num;
    }
    for(var j= 0; j< doc.length; j++) {
      doc[j].perc= Math.floor((doc[j].num/total)* 100)+ '%';
    }
    res.set('Content-Type', 'text/html');
    res.render('fishTable', {fishList: doc});
  });
});

module.exports = router;