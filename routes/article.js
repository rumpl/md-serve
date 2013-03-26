var fs = require('fs');
var path = require('path');
var marked = require('marked');

var options;

try {
  options = require(path.join(process.env.HOME, '.md-read.json'));
} catch (e) {
  console.warn('.md-read.json file not found, creatin one with directory: ', process.cwd())
  options = { directory: process.cwd()};
  fs.writeFile(path.join(process.env.HOME, '.md-read.json'), JSON.stringify(options));
}

exports.get = function (req, res) {
  var articleName = req.query.ar;
  var articleMd = fs.readFileSync(path.join(options.directory, articleName));

  marked.setOptions({
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true
  });

  var article = marked("" + articleMd);
  res.render('article', { title: articleName.replace(/-/g, ' ').replace('.md', ''), article : article });
};
