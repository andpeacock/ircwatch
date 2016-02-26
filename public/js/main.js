$(function() {
  var main= {
    init: function() {
      var self= this;
      self.binding();
    },
    binding: function() {
      var self= this;
      $('#rejoinZulu').on('click', function() {
        $.get('/rejoin', function(data) {});
      });
      $('#imgurh1').on('click', function() {
        headerClick('#imgurImg');
      });
      $('#todoh1').on('click', function() {
        headerClick('#todoList');
      });
      $('#zuluh1').on('click', function() {
        headerClick('#zuluList');
      });
      $('.imgDel').on('click', function() {
        var iid= $(this).data('id');
        $.post('/imgDel', {imgid: iid}, function(data) {
          document.location.reload(true);
        });
      });
      function headerClick(bod) {
        if($(bod).is(':visible'))
          $(bod).slideUp(300);
        else
          $(bod).slideDown(300);
      }
      $('.todoDel').on('click', function() {
        var tt= $(this).next('a').text();
        $.post('/todoDel', {todoText: tt}, function(data) {
          document.location.reload(true);
        });
      });
    }
  };
  main.init();
});