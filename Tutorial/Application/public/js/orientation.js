
var absolute = 0;
var alpha    = 0;
var beta     = 0;
var gamma    = 0;


window.addEventListener("deviceorientation", handleOrientation, true);
window.addEventListener("devicemotion", handleMotion, true);


function handleOrientation(event) {
  
  // Do stuff with the new orientation data
  absolute = event.absolute;
  alpha = update(alpha, event.alpha);
  beta.value = update2(beta, event.beta);
  //gamma.value = update(gamma, event.gamma);
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

  //oAcceleration.value = "Acceleration : x = " + accX + ", y = " + accY + ", z = " + accZ;
}

function handleMotionRotationRate(event){
  var alpha    = event.alpha;
  var beta     = event.beta;
  var gamma    = event.gamma;

  //oRotationRate.value = "Rotation Rate : alpha(z) = " + alpha + ", beta(x) = " + beta + ", gamma(y) = " + gamma;
}

function handleMotionInterval(event){
  var interval = event;

  //oInterval = interval;
}
