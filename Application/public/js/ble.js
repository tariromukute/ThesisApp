
var NOTREG = 0;
var RECEIVER = 1;
var SENDER = 2;
var UserType = NOTREG; // 0
let gattServer;
let chosenService;;
let writeCharacteristic;
let readCharacteristic;
let busy = false;
const bluetoothButton = document.querySelector('#the-button');


//send control commands to the robot
function sendCommand(cmd){
  document.querySelector('#send-cmd').innerHTML = 'send command ' + cmd;
  if (writeCharacteristic) {
    // Handle one command at a time
    document.querySelector('#value').innerHTML = 'write Characteristic was set';
    if (busy) {
      document.querySelector('#value').innerHTML = 'another process is busy';
    // Return if another operation pending
      return Promise.resolve();
    }
    busy = true;
    return writeCharacteristic.writeValue(cmd).then(() => {
      document.querySelector('#value').innerHTML = 'successfully sent';
      busy = false;
    })
    .catch(exception => {
        document.querySelector('#data').innerHTML = "Error " + exception;
    });
  } else {
    document.querySelector('#value').innerHTML = 'write characteristic not set';
    return Promise.resolve();
  }
}

//disconnect robot 
function disconnect(){
	
}

//request data from the robot, comes through as a notification
function requestNotification(type){
  sendCommand(type);
} 

bluetoothButton.addEventListener('click', function(){
  //register the User as a Receiver
  //setUserType(RECEIVER);  // Uncomment when using the webrtc, comment when using direct ble access : bleorien.html
  navigator.bluetooth.requestDevice({
    filters: [{
      services: ['c97433f0-be8f-4dc8-b6f0-5343e6100eb4'],
    }]
  })
  .then(device => device.gatt.connect())
  .then(server => {
    console.log("Found GATT server");
	gattServer = server;
	//get the service to control the robot
	return gattServer.getPrimaryService('c97433f0-be8f-4dc8-b6f0-5343e6100eb4')
  })
  .then(service => {
	console.log("Found the service to control the car");
    chosenService = service;
    //return the characteristic to 'write' send commands
	return chosenService.getCharacteristic('c97433f2-be8f-4dc8-b6f0-5343e6100eb4');
  })
  .then(characteristic => {
	console.log("Found write characteristic");
	writeCharacteristic = characteristic;
		
	return chosenService.getCharacteristic('c97433f1-be8f-4dc8-b6f0-5343e6100eb4');
  })
  .then(characteristic => {
	console.log('Found read characteristic');
	readCharacteristic = characteristic;
	//Listen to device notifications
	return readCharacteristic.startNotifications().then(() => {
	  readCharacteristic.addEventListener('characteristicvaluechanged', event => {
		console.log('characteristicvaluechanged now = ' + event.target.value + ' [' + event.target.value.byteLength +']');
		//document.querySelector('#data').innerHTML ='characteristicvaluechanged now = ' + event.target.value + ' [' + event.target.value.byteLength +']';
		if (event.target.value.byteLength >= 2) {
		  let value = new Uint8Array(event.target.value);
		  //switch to handle the possible case that might be occuring
		  switch(value[0]){
			
		  }
		}
	  });
	});
  })
  .catch(exception => {
        document.querySelector('#data').innerHTML = "Error " + exception;
  });
  
});

var c = 0;

function testWrite(){
  document.querySelector('#testW').innerHTML = 'testWrite running';
   c++
        const cmd = new Uint8Array([c, c]);
        sendCommand(cmd);
  
}

testBTButton = document.querySelector('#testBT-button');
testBTButton.addEventListener('click', function(){
   //c++
   //const cmd = new Uint8Array([c]);
   //sendCommand(cmd); 
   var dataRateBT = document.querySelector('#dataRateBT');   
   for(i = 0; i < 10; i++){
	  setInterval(function(){
		const cmd = new Uint8Array([i, i]);
        sendCommand(cmd); 
	  }, dataRateBT);
  }
});





function setUserType(type){
  UserType = type;
  if(type === RECEIVER){
    document.querySelector('#otherUsernameInput').display = 'none';
	document.querySelector('#connectToOtherUsernameBtn').display = 'none';
  }
  else if(type === SENDER){
	document.querySelector('#the-button').display = 'none';
	document.querySelector('#send-button').display = 'none';
	//document.querySelector('#geardiv').display = 'none';
  }
  
}