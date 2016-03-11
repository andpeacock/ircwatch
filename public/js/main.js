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
      $('#imgurh1').on({
        click: function() {
          headerClick('#imgurImg');
        },
        mouseenter: function() {
          window.setTimeout($('.imgDel').show(), 500);
        }
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
      /*
      $('.imglist').hover(function() {
        console.log("in hover");
        $(this).find('.imgDel').show();
      },function() {
        $(this).find('.imgDel').hide();
      });
      */
      function headerClick(bod) {
        if($(bod).is(':visible'))
          $(bod).slideUp(300);
        else
          $(bod).slideDown(300);
      }
      $('.todoDel').on('click', function() {
        var tt= $(this).data('id');
        $.post('/todoDel', {id: tt}, function(data) {
          document.location.reload(true);
        });
      });
    }
  };
  main.init();
});