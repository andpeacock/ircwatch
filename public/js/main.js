$(function() {
  var main= {
    init: function() {
      var self= this;
      self.binding();
    },
    binding: function() {
      $('#rejoinZulu').on('click', function() {
        $.get('/rejoin', function(data) {
          alert("rejoined");
        });
      });
      $('#imgurh1').on('click', function() {
        if($('imgurImg').is(':visible'))
          $('#imgurImg').slideUp(300);
        else
          $('#imgurImg').slideDown(300);
      });
    }
  };
  main.init();
});