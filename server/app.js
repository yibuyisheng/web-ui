var koa = require('koa');
var fs = require('fs');

var app = koa();

var readFile = function(path) {
  return function(fn) {
    fs.readFile(path, fn);
  };
};

var delay = function() {
  return function(fn) {
    setTimeout(fn, 1000);
  };
};
app.use(function *(){
  var path = __dirname.replace(/\/server$/, '') + this.request.url;

  try {
    this.body = yield readFile(path);
    yield delay();
    if (/(\.html)|(\.htm)$/i.test(path)) {
      this.type = 'text/html; charset=utf-8';
    } else if (/\.js$/i.test(path)) {
      this.type = 'application/javascript; charset=utf-8';
    }
  } catch (e) {
    console.log('===================', e);
  }
});

app.listen(3000);