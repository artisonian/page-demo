'use strict';

var PORT = process.env.PORT || 3000;
var OUTPUT = process.argv[2] || (__dirname + '/public/bundle.js');

var fs = require('fs');
var connect = require('connect');
var watchify = require('watchify');
var reactify = require('reactify');

connect()
  .use(connect.favicon())
  .use(connect.logger('dev'))
  .use(connect.static(__dirname + '/public'))
  .listen(+PORT);

var watch = watchify(__dirname + '/app.js');
var build = function () {
  watch
    .transform(reactify)
    .bundle()
    .pipe(fs.createWriteStream(OUTPUT));
};

watch.on('update', build);
build();
