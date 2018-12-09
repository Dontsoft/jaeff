var through = require('through2'); 

var PLUGIN_NAME = 'gulp-sass-namespace';

module.exports = function() {
   return through.obj((file, encoding, callback) => {
      let content = file.contents.toString('utf8');
      content = content.replace(/\.[a-zA-Z-_]+(?=\s|\{|)/g, ".jf--$&");
      content = content.replace(/\.jf--\./g, ".jf--");
      file.contents = new Buffer(content, 'utf8');
      callback(null, file);
   });
}