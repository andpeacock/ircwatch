var express= require('express');
var multer= require('multer');
var imgur= require('imgur');
var db= require('./db');
var router= express.Router();

var done= false;

/* GET home page. */
router.get('/', function (req, res) {
  db.get50('imgur', function (reply) {
    console.log(reply);
    res.render('index', {
      title: 'Random Shit'
    });
  });
});

function addPhotoList(link, cb) {
  db.lpush('imgur', link, function (reply) {
    console.log(reply);
    cb();
  });
}

router.use('/photo', multer({ dest: './uploads/',
  rename: function (fieldname, filename) {
    return filename+Date.now();
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function (file) {
    imgur.uploadFile(file.path).then(function (json) {
      console.log(json.data.link);
      addPhotoList(json.data.link, function() {
        return done= true;
      });
    }).catch(function (err) {
      console.error(err.message);
    });
  }
}));
router.post('/photo', function (req, res){
  if(done==true){
    res.redirect('/');
  }
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

module.exports = router;