(function($) {

$(document).ready(function() {

  var photos = {};

  // Listen for photo details.
  var socket = io.connect();  
  socket.on('photo details', function(data) {
    var index = parseInt(data.index);
    photos[index] = data;
    showPhotoDetails(index);
  });

  // Emit photo hover events.
  $('ul li img').hover(function() {
    $(this).parent().append('<div class="details"></div>');
    var index = parseInt($(this).attr('rel'));
    if (typeof photos[index] == 'undefined') {
      socket.emit('photo hover', {index: index});
    }
    else {
      showPhotoDetails(index);
    }
  }, function() {
    $(this).parent().find('.details').remove();
  });

  var showPhotoDetails = function(index) {
    var photo = photos[index];
    var li = $('img[rel="' + index + '"]').parent();
    var details = li.find('.details');
    
    if (typeof photo.user.full_name != 'undefined' && photo.user.full_name.length > 0) {
      details.append('<p>' + 'By: ' + photo.user.full_name + '</p>');
    }
    if (typeof photo.caption != 'undefined' && photo.caption.length > 0) {
      details.append('<p>"' + photo.caption + '"</p>');
    }

    details.fadeIn('fast');
  }


});

})(jQuery);
