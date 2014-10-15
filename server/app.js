var koa = require('koa');
var fs = require('fs');

var app = koa();

// x-response-time

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
});

// logger

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

var readFile = function(path) {
  return function(fn) {
    fs.readFile(path, fn);
  };
};
app.use(function *(){
  var path = __dirname.replace(/\/server$/, '') + this.request.url;

  try {
    this.body = yield readFile(path);
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