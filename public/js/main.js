$(function() {
  var main= {
    init: function() {
      var self= this;
      self.binding();
      self.notifs();
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
    notifs: function() {
      // Notification.requestPermission().then(function(result) {
      //   console.log(result);
      // });
      // function spawnNotification(theBody,theIcon,theTitle) {
      //   var options = {
      //       body: theBody
      //       //icon: theIcon
      //   }
      //   var n = new Notification(theTitle,options);
      //   setTimeout(n.close.bind(n), 5000); 
      // }
      function randomNotification() {
        var randomQuote = "testing this";
        var options = {
          body: randomQuote
          //icon: 'img/sad_head.png',
        }
        var n = new Notification('Emogotchi says',options);
        setTimeout(n.close.bind(n), 5000); 
      }
    }
  };
  main.init();
});