$(function() {
  var main= {
    init: function() {
      var self= this;
      self.binding();
      //self.notifs();
    },
    binding: function() {
      var self= this;
      $('#rejoinZulu').on('click', function() {
        $.get('/rejoin', function(data) {
          document.location.reload(true);
        });
      });
      $('#shutdownCommand').on('click', function() {
        var num= parseFloat($('#shutdownNum').val());
        var sec= (num*60)* 60; //(num*minutes)*seconds
        $('#shutdownNum').val("shutdown –s –t "+ sec);
      });
      $('#imgurh1').on({
        click: function() {
          headerClick('#imgurImg');
        }
      });
      $('#todoh1').on('click', function() {
        headerClick('#todoList');
      });
      $('#zuluh1').on('click', function() {
        headerClick('#zuluList');
      });
      $('#fishh1').on('click', function() {
        headerClick('#fishForm');
      });
      $('#getFishTable').on('click', function() {
        console.log($('#locSel').val());
        $.get('/fish', {loc: "Splash Town"}, function(data) {
          $('#fishTable').remove();
          $('#getFishTable').parent().parent().append(data);
        });
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
        var tt= $(this).data('id');
        $.post('/todoDel', {id: tt}, function(data) {
          document.location.reload(true);
        });
      });
    },
    notifs: function(text) {
      // Notification.requestPermission().then(function(result) {
      //   console.log(result);
      // });
      return new Notification(text, {tag: 'soManyNotification'});
    }
  };
  main.init();
});