var express= require('express');
var multer= require('multer');
var imgur= require('imgur');
var db= require('./db');
var db2= require('./db2');
var router= express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  db.getMultiList(['imgur', 'zulu'], function (rlist) {
    db.getTodo(function (todoRet) {
      console.log("above get all");
      db2.allLinks(function(res) {
        console.log(res);
      });
      res.render('index', {
        title: 'Random Shit',
        linkList: rlist[0],
        zuluList: rlist[1],
        todo: todoRet
      });
    });
  });
});
/*
var allarr= ["http://i.imgur.com/4y0Ro0J.jpg",
"http://i.imgur.com/qBbgTBC.jpg",
"http://i.imgur.com/4rMTOSP.jpg",
"http://i.imgur.com/wwyI1xS.jpg",
"http://i.imgur.com/gZTSUrm.jpg",
"http://i.imgur.com/X99sWap.jpg",
"http://i.imgur.com/ZOUrVyh.jpg",
"http://i.imgur.com/jVuycNs.jpg",
"http://i.imgur.com/OEwcnm8.jpg",
"http://i.imgur.com/W5qTwy9.png",
"http://i.imgur.com/nUEeJHo.png",
"http://i.imgur.com/f9Oq9rF.jpg",
"http://i.imgur.com/5E9frAB.jpg",
"http://i.imgur.com/hrulnf1.jpg",
"http://i.imgur.com/okPX5vV.jpg",
"http://i.imgur.com/8Q68ByZ.jpg",
"http://i.imgur.com/HXwq7pu.jpg",
"http://i.imgur.com/SR15TOT.jpg",
"http://i.imgur.com/shXZJZ1.jpg",
"http://i.imgur.com/lPPlndy.jpg",
"http://i.imgur.com/X8QCp5i.jpg",
"http://i.imgur.com/S65eRLp.jpg",
"http://i.imgur.com/khzjLZ5.jpg",
"http://i.imgur.com/JUS6pZl.jpg",
"http://i.imgur.com/UZwpvhH.png",
"http://i.imgur.com/x4hzMnw.png",
"http://i.imgur.com/Ue5asdT.png",
"http://i.imgur.com/TvAWWpJ.png",
"http://i.imgur.com/K4WQ3EE.png",
"http://i.imgur.com/tiffL0a.jpg",
"http://i.imgur.com/0GUp727.jpg",
"http://i.imgur.com/Cvdgt22.jpg",
"http://i.imgur.com/gA8jRke.jpg",
"http://i.imgur.com/AkIkBAX.jpg",
"http://i.imgur.com/ahH2JWm.jpg",
"http://i.imgur.com/x44O7hV.jpg",
"http://i.imgur.com/YRghL4G.jpg",
"http://i.imgur.com/GvJlVxe.png",
"http://i.imgur.com/ZBRZrDm.jpg",
"http://i.imgur.com/Bi6Nr8l.png",
"http://i.imgur.com/YYpKufm.jpg",
"http://i.imgur.com/I2XMELq.jpg",
"http://i.imgur.com/roWUSCt.jpg",
"http://i.imgur.com/asglTkH.jpg",
"http://i.imgur.com/eEBsTbi.png",
"http://i.imgur.com/L0U6yh8.jpg",
"http://i.imgur.com/idwbc3p.jpg",
"http://i.imgur.com/ijH4WWb.jpg",
"http://i.imgur.com/FA5cNiH.jpg",
"http://i.imgur.com/LwyesaT.jpg",
"http://i.imgur.com/bErxXg3.jpg",
"http://i.imgur.com/MUoKwiz.png",
"http://i.imgur.com/xUlze7a.jpg",
"http://i.imgur.com/i23CRE1.jpg",
"http://i.imgur.com/MvOu5og.png",
"http://i.imgur.com/OUpf918.png",
"http://i.imgur.com/lPiMXQE.png"];

allarr.map(function(item) {
  return db2.saveLink(item);
});
*/
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