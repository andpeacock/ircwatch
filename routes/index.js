var express= require('express');
var multer= require('multer');
var imgur= require('imgur');
var db= require('./db');
var router= express.Router();

var done= false;

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

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
      done= true;
    }).catch(function (err) {
      console.error(err.message);
    });
  }
}));
router.post('/photo', function (req, res){
  if(done==true){
    //res.end("File uploaded.");
    res.redirect('/');
  }
});

router.post('/link', function (req, res) {
  imgur.uploadUrl(req.body.photoLink).then(function (json) {
    console.log(json.data.link);
    res.end("Complete");
  }).catch(function (err) {
    console.error(err.message);
  });
});



module.exports = router;
