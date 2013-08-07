var express = require('express');
var spawn = require('child_process').spawn;
var fs = require('fs');
var uuid = require('uuid');

var app = express();
app.set('view engine', 'ejs');
app.set('views', './views');

function subset(req, res) {
  var fontType = req.param('fontType');
  var charactors = req.param('charactors');
  var fontUUID = uuid.v1();
  var output = 'fonts/' + fontUUID + '.ttf';
  var input = '../font-lib/' + fontType;
  var subset = spawn('perl', [
    'subset.pl',
    '--chars="' + charactors + '"',
    input,
    '../' + output
  ], {
    encoding: 'utf8',
    cwd: './perl'
  });

  subset.stdout.on('data', function(data) {
    console.log('stdout: \n' + data);
  });

  subset.stderr.on('data', function(data) {
    console.log('stderr: \n' + data);
  });

  subset.on('close', function() {
    fs.stat(output, function(err, stats) {
      res.jsonp({
        'fontPath': output,
        'fontSize': stats.size,
        'fontType': fontType,
        'fontUUID': fontUUID
      });
    });
  });
}

app.get('/', function(req, res) {
  fs.readdir('./font-lib', function(err, files) {
    res.render('index', {
      'files': files.filter(function(file) {
        return file.toUpperCase().substr(-4) == '.TTF';
      })
    });
  });
});

app.get('/font', function(req, res) {

  fs.exists('./fonts/', function(exists) {
    if (!exists) {
      fs.mkdir('fonts', function() {
        subset(req, res);
      });
    } else {
      subset(req, res);
    }
  });

});

app.use('/fonts', express.static('./fonts'));
app.use('/js', express.static('./public/js'));
app.use('/css', express.static('./public/css'));

app.listen(process.env.PORT || 3000);