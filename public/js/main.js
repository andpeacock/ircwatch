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
        headerClick('#imgurImg');
        // if($('#imgurImg').is(':visible'))
        //   $('#imgurImg').slideUp(300);
        // else
        //   $('#imgurImg').slideDown(300);
      });
      $('#todoh1').on('click', function() {
        headerClick('#todoList');
      });
      $('#zuluh1').on('click', function() {
        headerClick('#zuluList');
      });
      function headerClick(bod) {
        if($(bod).is(':visible'))
          $(bod).slideUp(300);
        else
          $(bod).slideDown(300);
      }
      $('.todoDel').on('click', function() {
        var tt= $(this).prev('p').text();
        console.log(tt);
        $.post('/todoDel', {todoText: tt}, function(data) {
          window.location(data);
        });
      });
    }
  };
  main.init();
});