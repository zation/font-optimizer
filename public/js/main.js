$(function() {
  var style;
  

  function sendRequest(fontType, content) {
    $.ajax({
      url: '/font',
      dataType: 'jsonp',
      data: {
        'charactors': content,
        'fontType': fontType
      },
      success: function(data) {
        if (style) {
          style.remove();
        }
        style = $('<style>');
        var fontface = '@font-face {' +
          'font-family: a' + data.fontUUID + ';' +
          'src: url(' + data.fontPath + ');' +
          'font-weight:400;' +
          '}';
        style.text(fontface);
        $('head').append(style);
        $('.result').text(JSON.stringify(data));
        $('.content').css('font-family', 'a' + data.fontUUID);
        $('.download').attr('href', data.fontPath);
      }
    });
  }

  function getFont() {
    var fontType = $('.font-type').val();
    var content = $('.content').text();
    sendRequest(fontType, content);
  }

  getFont();

  $('.font-type').on('change', getFont);
  $('.regenerate').on('click', getFont);
});