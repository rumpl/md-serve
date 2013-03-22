var fs = require('fs');
var path = require('path');

var options;

try {
  options = require(path.join(process.env.HOME, '.md-read.json'));
} catch (e) {
  console.warn('.md-read.json file not found, creatin one with directory: ', process.cwd())
  options = { directory: process.cwd()};
  fs.writeFile(path.join(process.env.HOME, '.md-read.json'), JSON.stringify(options));
}

/*
 * GET home page.
 */
exports.index = function (req, res) {
  loadArticles(function (articles) {
      res.render('index', { title: 'Express', articles: articles });
    }
  );
};

function loadArticles(callback) {
  fs.readdir(options.directory, function (error, files) {
    callback(files);
  })
}
