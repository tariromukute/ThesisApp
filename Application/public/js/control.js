var geardiv = document.getElementById("geardiv");
var gear = document.getElementById("gear");
var rtcvideo = document.getElementById("rtcvideo");
var camera = document.getElementById("camera");


/**$( function () {
  $( document ).on ( "vmousemove", "#target", function(event) {
  var msg = "Handler for .vmousemove() called at ";
  msg += event.pageX + ", " + event.pageY;
  $( "#log" ).append( " <div>" + msg + "</div>" );
});
*/

$(document).on("pagecreate","#body",function(){
  $("#gear").on("tap",function(){
    $(this).css("backgroundColor", "#000");
  });
  $("#gear").on("taphold",function(){
    $(this).css("backgroundColor", "#777");
  });
  $("#geardiv").on("vmousemove", function(event){
    gear.css("left", event.clientX);
  });
});
