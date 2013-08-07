var express = require('express');
var spawn = require('child_process').spawn;
var fs = require('fs');

var app = express();

function subset(req, res) {
  var charactors = req.param('charactors');
  var output = 'fonts/output.ttf';
  var input = '../font-lib/test.ttf'
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
    res.jsonp({
      'fontPath': output
    });
  });
}

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

app.listen(process.env.PORT || 3000);