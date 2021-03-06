var geardiv = document.getElementById("geardiv");
var gear = document.getElementById("gear");
var rtcvideo = document.getElementById("rtcvideo");
var swidth = window.screen.width;
var sheight = window.screen.height;
var speed = 0;

// for use in orientation.js
// makes them available for use in this script. 
var absolute = 0;
var alpha    = 0;
var beta     = 0;
var gamma    = 0;

function start() {
  var gear = document.getElementById("gear");
  var geardiv = document.getElementById("geardiv");
  var ratio = window.devicePixelRatio || 1;
  var swidth = window.screen.width;
  var sheight = window.screen.height;
  gear.addEventListener("touchstart", colorChange, false);
  geardiv.addEventListener("touchmove", moveHandler, false);
  gear.addEventListener("touchend", touchEnd, false);
  var vid = document.getElementById("vid");
  vid.style.width = sheight - geardiv.clientHeight - 20 + 'px' ;
  console.log(sheight - geardiv.clientHeight + 'px' );
  console.log("screen" + screen.width);
  console.log("window" + window.screen.width);
  console.log("window" + window.screen.width*ratio);
}

function colorChange(event) {
  var gear = document.getElementById("gear");
  gear.style.backgroundColor = "#000";
  var to = event.changedTouches[0];
  console.log(to.pageX + 'px');
  //gear.css("backgroundColor", "#000");
}

function moveHandler(event){
  var gear = document.getElementById("gear");
  var touch = event.changedTouches[0];
  gear.style.margin = "0px"; //remove the centering effect
  var pos = (touch.pageX);
  if(pos > swidth - 40) // 40 is the diameter of the gear
	pos = swidth-40;
  else if(pos < 0 + 40)
	pos = 40;
  speed = updateSpeed(speed, ((pos)/swidth - 0.5) * 100, pos);
  
  console.log(speed);  
}

function touchEnd(){
  var gear = document.getElementById("gear");
  //gear.style.backgroundColor = "#000";
  gear.style.margin = "auto"; //put gear back to center
  gear.style.left = '0px';
  speed = 0;
}

function updateSpeed(prev, curr, position){
  if(Math.abs(prev - curr) > 5){
	//sendDrive( null, Math.floor(curr));
	gear.style.left = position -25 + 'px';
    return Math.floor(curr);
  }else{
	//gear.style.left = position -25 + 'px';
    return prev;
  }
}

function sendDrive(){
  if(!busy){
	sendCommand(new Uint8Array( [alpha, speed] ));	
  }
}

window.setInterval(sendDrive, 500);


