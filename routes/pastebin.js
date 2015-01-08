var pastebin= require('pastebin')('ff89e92a9a25f6febb3c6b798c20a4a6');
function newPaste(cont, cb) {
  pastebin.new({title: 'test', content: cont, privacy: 1, expire:'1D'}, function (err, ret) {
    if (err) return console.log(err);
    else
      cb(ret);
  });
}
module.exports.newPaste= newPaste;