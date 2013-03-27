/**
 * Module dependencies.
 */
var fs = require('fs');

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , article = require('./routes/article')
  , http = require('http')
  , path = require('path');

var app = express();
var options;

try {
  options = require(path.join(process.env.HOME, '.md-read.json'));
} catch (e) {
  console.warn('.md-read.json file not found, creatin one with directory: ', process.cwd());
  options = { directory: process.cwd()};
  fs.writeFile(path.join(process.env.HOME, '.md-read.json'), JSON.stringify(options));
}

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.use(function (req, res, next) {
    loadArticles(function (articles) {
      res.locals.articles = articles;
      next();
    });
  });

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/article', article.get);

function loadArticles(callback) {
  fs.readdir(options.directory, function (error, files) {
    var articles = [];
    for (var i = 0; i < files.length; i++) {
      articles.push({ title: files[i].replace(/-/g, ' ').replace('.md', ''), file: files[i]});
    }
    callback(articles);
  });
}

http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});
