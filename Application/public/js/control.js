var geardiv = document.getElementById("geardiv");
var gear = document.getElementById("gear");
var rtcvideo = document.getElementById("rtcvideo");
var camera = document.getElementById("camera");
var ratio = window.devicePixelRatio || 1;
var swidth = window.screen.width * ratio;
var sheight = window.screen.height * ratio;


/**$( function () {
  $( document ).on ( "vmousemove", "#target", function(event) {
  var msg = "Handler for .vmousemove() called at ";
  msg += event.pageX + ", " + event.pageY;
  $( "#log" ).append( " <div>" + msg + "</div>" );
});
*/
/**
$(document).on("pagecreate","#body",function(){
  $("#rtcvideo").css({maxHeight: sheight - 104});
  $('#rtcvideo').css({right: $("#geardiv").height()});
  $("#gear").on("tap",function(){
    $(this).css("backgroundColor", "#000");
  });
  $("#gear").on("taphold",function(){
    $(this).css("backgroundColor", "#777");
  });
});

$(document).on("vmousemove", "#geardiv", function(event){
  $("#gear").parent().css({position: 'relative'});
  $("#gear").css({left:event.pageX - 5 });
});
*/

