$( function () {
  $( document ).on ( "vmousemove", "#target", function(event) {
  var msg = "Handler for .vmousemove() called at ";
  msg += event.pageX + ", " + event.pageY;
  $( "#log" ).append( " <div>" + msg + "</div>" );
});

var geardiv = document.getElementById("geardiv");
var gear = document.getElementById("gear");
var rtcvideo = document.getElementById("rtcvideo");
var camera = document.getElementById("camera");

//size_attributes();
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

function size_attributes(){
  container.style.height = sheight;
  gearholder.style.height = gearSize;
  gear.style.height = gearSize - 2;
  videoholder.style.height = videoSize;
  livestream.style.top = gearSize + 2 ;
}

function over_handler(event) { }

function enter_handler(event) { 
  event.target.style.background = "red";
}

function down_handler(event) { }

function move_handler(event) {
  if(event.target.id == "gear" && event.clientY < gearSize){
    event.target.style.left = event.clientX;
  }
}

function up_handler(event) { }

function cancel_handler(event) { }

function out_handler(event) { 
  gear.style.left = 0;
  gear.style.color = "blue";
}

function leave_handler(event) { }

function gotcapture_handler(event) { }

function lostcapture_handler(event) { }

function changeScreen(){
  var cols = document.getElementsByClassName('element');
  for(i = 0; i < cols.length; i++) {
    cols[i].classList.toggle('show_element');
    cols[i].classList.toggle('hide_element');
  }
}

