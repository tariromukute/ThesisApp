let gattServer;
let chosenService;;
let writeCharacteristic;
let readCharacteristic;
let busy = false;
const bluetoothButton = document.querySelector('#the-button');


//send control commands to the robot
function sendCommand(cmd){
  if (writeCharacteristic) {
    // Handle one command at a time
    if (busy) {
    // Return if another operation pending
      return Promise.resolve();
    }
    busy = true;
    return writeCharacteristic.writeValue(cmd).then(() => {
      busy = false;
    });
  } else {
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
  navigator.bluetooth.requestDevice({
    filters: [{
      services: ['c97433f0-be8f-4dc8-b6f0-5343e6100eb4'],
    }]
  })
  .then(device => device.gatt.connect())
  .then(server => {
    console.log("Found GATT server");
	gattServer = server;
	//get the service to control the car
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
	//return read characteristic
	return chosenService.getCharacteristic('c97433f1-be8f-4dc8-b6f0-5343e6100eb4');
  })
  .then(characteristic => {
	console.log('Found read characteristic');
	readCharacteristic = characteristic;
	//Listen to device notifications
	return readCharacteristic.startNotifications().then(() => {
	  readCharacteristic.addEventListener('characteristicvaluechanged', event => {
		console.log('characteristicvaluechanged now = ' + event.target.value + ' [' + event.target.value.byteLength +']');
		document.querySelector('#data').innerHTML ='characteristicvaluechanged now = ' + event.target.value + ' [' + event.target.value.byteLength +']';
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
  
  setTimeout(testWrite, 3000);
});




function testWrite(){
  for( i = 0; i < 5; i++){
	setTimeout(sendCommand(i), 1500);
  }
}
