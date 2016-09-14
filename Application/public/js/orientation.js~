

var oAbsolute = document.querySelector('#oAbsolute');
var oAlpha = document.querySelector('#oAlpha');
var oBeta = document.querySelector('#oBeta');
var oGamma = document.querySelector('#oGamma');
var oAcceleration = document.querySelector('#oAcceleration');
var oRotationRate = document.querySelector('#oRotationRate');
var oInterval = document.querySelector('#oInterval');


window.addEventListener("deviceorientation", handleOrientation, true);
window.addEventListener("devicemotion", handleMotion, true);


function handleOrientation(event) {
  var absolute = event.absolute;
  var alpha    = event.alpha;
  var beta     = event.beta;
  var gamma    = event.gamma;

  // Do stuff with the new orientation data
  oAbsolute.value = absolute;
  oAlpha.value = update(oAlpha.value, alpha);
  oBeta.value = update2(oBeta.value, beta);
  oGamma.value = update(oGamma.value, gamma);
}

function update(prev, curr){
  if(Math.abs(prev - curr) > 5){
    //send data via channel
    message(Math.floor(curr));
    return Math.floor(curr);
  }else{
    return prev;
  }
}

function update2(prev, curr){
  if(Math.abs(prev - curr) > 5){
    //send data via channel
    message2(Math.floor(curr));
    return Math.floor(curr);
  }else{
    return prev;
  }
}
function handleMotion(event){
  handleMotionAcceleration(event.acceleration);
  handleMotionRotationRate(event.rotationRate);
  handleMotionInterval(event.interval);   
}

function handleMotionAcceleration(event){
  var accX = event.x;
  var accY = event.y;
  var accZ = event.z;

  oAcceleration.value = "Acceleration : x = " + accX + ", y = " + accY + ", z = " + accZ;
}

function handleMotionRotationRate(event){
  var alpha    = event.alpha;
  var beta     = event.beta;
  var gamma    = event.gamma;

  oRotationRate.value = "Rotation Rate : alpha(z) = " + alpha + ", beta(x) = " + beta + ", gamma(y) = " + gamma;
}

function handleMotionInterval(event){
  var interval = event;

  oInterval = interval;
}
