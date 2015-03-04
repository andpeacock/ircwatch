$(function() {
  var main= {
    init: function() {
      var self= this;
      self.binding();
    },
    binding: function() {
      var self= this;
      $('#rejoinZulu').on('click', function() {
        $.get('/rejoin', function(data) {
          alert("rejoined");
        });
      });
      $('#imgurh1').on('click', function() {
        if($('#imgurImg').is(':visible'))
          $('#imgurImg').slideUp(300);
        else
          $('#imgurImg').slideDown(300);
      });
      $('.todoDel').on('click', function() {
        var tt= $(this).prev('p').text();
        $.get('/todoDel', {todoText: tt}, function(data) {
          console.log(data);
        });
      });
    }
  };
  main.init();
});