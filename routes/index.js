var express= require('express');
var multer= require('multer');
var imgur= require('imgur');
var db= require('./db');
var db2= require('./db2');
var router= express.Router();
//var encount= 0;

var Jimp = require('jimp'); //for cropping images -- can also diff with it
//var resemble= require('node-resemble-js'); //for matching images

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
router.use('/fishpic', multer({ dest: './uploads/',
  rename: function (fieldname, filename) {
    return filename+Date.now();
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function (file) {
    //get initial image from url
    Jimp.read("http://i.imgur.com/btM9xKb.jpg", function (err, img1) {
      // do stuff with the image (if no exception)
      var img= img1;
      Jimp.read(file.path, function (err, image) {
        //change greyscale and scale to be what I need instead
        image.crop(48, 128, 41, 41, function(err, image) {
          var img2= image;
          console.log(img2);
          console.log(img);
          var diff = Jimp.diff(img2, img); // threshold ranges 0-1 (default: 0.1)
          //diff.image;   // a Jimp image showing differences
          //diff.percent;
          console.log("diff percent: "+ diff.percent);
          console.log(diff);
          /*
          (diff.percent < 0.15) ? console.log("in if match") : console.log("in else no match");
          image.write(file.path, function(err, image) {
            imgur.uploadFile(file.path).then(function (json) {
              addPhotoList(json.data.link, function() {
                return;
              });
            }).catch(function (err) {
              console.error(err.message);
            });
          });
          */
        });
      });
    });
    //move 5 left, 2 down for start then+ 41

    //TEST
    //x= 49
    //y= 128
    /*
    Jimp.read(file.path, function (err, image) {
      //change greyscale and scale to be what I need instead
      image.crop(49, 128, 41, 41, function(err, image) {

      }); 
      //this.greyscale().scale(0.5).write(file.path, function(err, image) {
        //maybe don't need this because no reason to upload to imgur
        // imgur.uploadFile(file.path).then(function (json) {
        //   addPhotoList(json.data.link, function() {
        //     return;
        //   });
        // }).catch(function (err) {
        //   console.error(err.message);
        // });
      //});
    });
    */
  }
}));
router.post('/fishpic', function(req, res) {
  //do shit
  return console.log("hi");
});
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