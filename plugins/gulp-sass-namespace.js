var through = require('through2'); 

var PLUGIN_NAME = 'gulp-sass-namespace';

module.exports = function() {
   return through.obj((file, encoding, callback) => {
      var test  = '.card {border-radius: $default-border-radius;margin: 16px;padding: 16px;@include box-shadow2(0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24));&.with-hover:hover, &.with-hover:focus {@include box-shadow2(0 4px 6px rgba(0,0,0,0.25), 0 4px 4px rgba(0,0,0,0.22));}}'
      console.log(test);
      test = test.replace(/\.[a-zA-Z-_]+(?=\s|\{|)/g, ".jf--$&");
      console.log(test);
      test = test.replace(/\.jf--\./g, ".jf--");
      console.log(test);
      let content = file.contents.toString('utf8');
      content = content.replace(/\.[a-zA-Z-_]+(?=\s|\{|)/g, ".jf--$&");
      content = content.replace(/\.jf--\./g, ".jf--");
      file.contents = new Buffer(content, 'utf8');
      callback(null, file);
   });
}