var pastebin= require('pastebin')('###');
function newPaste(cont, cb) {
  pastebin.new({title: 'test', content: cont, privacy: 1, expire:'1D'}, function (err, ret) {
    if (err) return console.log(err);
    else
      cb(ret);
  });
}
module.exports.newPaste= newPaste;