'use strict';

var PORT = process.env.PORT || 3000;
var OUTPUT = process.argv[2] || (__dirname + '/public/bundle.js');

var fs = require('fs');
var connect = require('connect');
var watchify = require('watchify');

connect()
  .use(connect.favicon())
  //.use(connect.static(__dirname + '/public'))
  .use(function (req, res) {
    var filepath = '/' + (req.url === '/bundle.js' ? 'public/bundle.js' : 'public/index.html');
    fs.createReadStream(__dirname + filepath).pipe(res);
  })
  .listen(+PORT);

var watch = watchify(__dirname + '/app.js');
var build = function () {
  watch
    .bundle()
    .pipe(fs.createWriteStream(OUTPUT));
}

watch.on('update', build);
build();
