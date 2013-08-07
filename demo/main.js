$(function() {
  $.ajax({
    url: 'http://webfont.herokuapp.com/font',
    // url: 'http://localhost:3000/font',
    dataType: 'jsonp',
    data: {
      'charactors': '昨日'
    },
    success: function(data) {
      var fontface = '@font-face {' +
        'font-family: test;' +
        'src: url(http://webfont.herokuapp.com/' + data.fontPath + ');' +
        // 'src: url(http://localhost:3000/' + data.fontPath + ');' +
        'font-weight:400;' +
        '}';
      $('head').append('<style>' + fontface + '</style>');
    }
  });
});