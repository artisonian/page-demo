'use strict';

var fs = require('fs');
var path = require('path');

var PORT = process.env.PORT || 3000;
var OUTPUT = process.argv[2] || path.join(__dirname, 'public', 'bundle.js');

var connect = require('connect');
var watchify = require('watchify');
var reactify = require('reactify');

connect()
  .use(connect.favicon())
  .use(connect.logger('dev'))
  .use(connect.static(path.join(__dirname, 'public')))
  .listen(+PORT);

var watch = watchify(path.join(__dirname, 'app.js'));
var build = function () {
  watch
    .transform(reactify)
    .bundle()
    .pipe(fs.createWriteStream(OUTPUT));
};

watch.on('update', build);
build();
