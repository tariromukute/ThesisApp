var geardiv = document.getElementById("geardiv");
var gear = document.getElementById("gear");
var rtcvideo = document.getElementById("rtcvideo");
var camera = document.getElementById("camera");
var ratio = window.devicePixelRatio || 1;
var swidth = window.screen.width * ratio;
var sheight = window.screen.height * ratio;
//var gearSize = Math.floor(0.1 * sheight);


/**$( function () {
  $( document ).on ( "vmousemove", "#target", function(event) {
  var msg = "Handler for .vmousemove() called at ";
  msg += event.pageX + ", " + event.pageY;
  $( "#log" ).append( " <div>" + msg + "</div>" );
});
*/
/**
$(document).on("pagecreate","#body",function(){
  $("#gear").on("tap",function(){
    $(this).css("backgroundColor", "#000");
  });
});
*/

init();

function init() {
 // Register pointer event handlers
 gear.onpointerover = over_handler;
 gear.onpointerenter = enter_handler;
 gear.onpointerdown = down_handler;
 gear.onpointermove = move_handler;
 gear.onpointerup = up_handler;
 gear.onpointercancel = cancel_handler;
 gear.onpointerout = out_handler;
 gear.onpointerleave = leave_handler;
 gear.gotpointercapture = gotcapture_handler;
 gear.lostpointercapture = lostcapture_handler;
}


function over_handler(event) { }

function enter_handler(event) { 
  gear.css("backgroundColor", "#000");
}
function down_handler(event) {
  gear.css("backgroundColor", "#000");
}

function move_handler(event) {
  if(event.target.id == "gear"){
    $(this).css("left", event.clientX);
  }
}
function up_handler(event) { }
function cancel_handler(event) { }
function out_handler(event) { 
  gear.css("left", "0px");
  gear.css("backgroundColor", "#555");
}
function leave_handler(event) { }
function gotcapture_handler(event) { }
function lostcapture_handler(event) { }

