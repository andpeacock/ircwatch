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
        //db2.fish.getLocList(function(loclist) {
          res.render('index2', {
            title: 'Hub',
            linkList: llist,
            zuluList: rlist[0],
            todo: todoRet
            //loclist: loclist //was for fish table
          });
        //});
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
    //http://i.imgur.com/wTeLNnL.jpg --url for wep stone
    //http://i.imgur.com/sfoReqe.jpg --url for tree belt
    var totalcount= 0;
    var truecount= 0;
    Jimp.read("http://i.imgur.com/sfoReqe.jpg", function (err, img1) {
      // do stuff with the image (if no exception)
      var img= img1;
      Jimp.read(file.path, function (err, image) {
        //change greyscale and scale to be what I need instead
        //48, 128
        function rcrop(x, y, image, cb) {
          image.crop(x, y, 41, 41, function(err, image) {r
            var img2= image;
            var distance = Jimp.distance(img, img2);
            var diff = Jimp.diff(img, img2); // threshold ranges 0-1 (default: 0.1)
            var retbool= false;

            //134, 2
            console.log("diff percent: "+ diff.percent);
            console.log(diff);
            console.log("distance: "+ distance);
            //(distance < 0.15 || diff.percent < 0.2) ? console.log("in if match") : console.log("in else no match");
            //(diff.percent < 0.15) ? console.log("in if match") : console.log("in else no match");
            if(distance < 0.15 || diff.percent < 0.2)
              retbool= true;
            else
              retbool= false;
            cb(x, y, retbool);
          });
        }
        // rcrop(5, 2, image);
        // while(totalcount< 8) {
        //   totalcount++;
        //   if(distance < 0.15 || diff.percent < 0.2) {
        //     truecount++;
        //     console.log("in if match")
        //   }
        // }
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