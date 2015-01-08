$(function() {
  $('#rejoinZulu').on('click', function() {
    $.get('/rejoin', function(data) {
      alert("rejoined");
    });
  });
});