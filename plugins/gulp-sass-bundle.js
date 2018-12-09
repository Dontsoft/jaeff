var through = require('through2'); 

var PLUGIN_NAME = 'gulp-sass-bundle';

var Bundler = new require('scss-bundle').Bundler;

module.exports = function() {
   return through.obj((file, encoding, callback) => {
      var bundler = new Bundler();
      console.log(file);
      bundler.Bundle(file).then((result) => {
         console.log(result);
         callback(null, file);
      });
   });
}