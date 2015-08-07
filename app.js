var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var FS = require('fs');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use('/vendor', express.static(path.join(__dirname, './node_modules')));
app.use('/assets', express.static(path.join(__dirname, './dist/assets')));
app.use('/app', express.static(path.join(__dirname, './dist')));
app.use('/main.js', express.static(path.join(__dirname, './dist/main.js')));

app.use('/views/partials/:file', function(req, res) {
  FS.readFile(path.join(__dirname, './dist/views/partials/' + req.params.file), function(err, fileContent) {
    console.log(err);
    res.send(fileContent);
  });
});

app.get('/', function(req, res) {
	res.set('X-UA-Compatible', 'IE=edge'); /*as if*/
	res.set('Content-Type', 'text/html; charset=UTF-8');
	res.set('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
	res.set("Pragma", "no-cache");
	res.set("Expires", '0');

  var file = FS.createReadStream(path.join(__dirname, './dist/index.html'));
	file.pipe(res);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
