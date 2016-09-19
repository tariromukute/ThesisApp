
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
});

$(document).on("vmousemove", "#geardiv", function(event){
  $("#gear").parent().css({position: 'relative'});
  $("#gear").css({left:event.pageX - 5 });
});
