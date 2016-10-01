/**
  Javascript test code for the Web Bluetooth API
*/


//const button = document.querySelector('#the-button');
const receiveButton = document.querySelector('#receive-button');
receiveButton.addEventListener('click', function() {
  document.querySelector('#info').innerHTML = 'Connecting....';
  navigator.bluetooth.requestDevice({
	filters: [{
		services: ['c97433f0-be8f-4dc8-b6f0-5343e6100eb4']
	}]
  }).then(device => {
    document.querySelector('#data').innerHTML = 'Device Name ' + device.name;
    return device.gatt.connect();
  }).then(server => {
	console.log('Getting Remote Control Service…');
	return server.getPrimaryService('c97433f0-be8f-4dc8-b6f0-5343e6100eb4');
  }).then(service => {
	console.log('Getting Remote Control Characteristic…');
	return service.getCharacteristic('c97433f1-be8f-4dc8-b6f0-5343e6100eb4');
  })
  .then(characteristic => {
	console.log('Reading Remotte Control Data…');
        if(characteristic === null){
          document.querySelector('#value').innerHTML = "Charateristic value is null";
        }
	return characteristic.readValue();
  }).then(value => {
	value = value.buffer ? value : new DataView(value);
	console.log('Battery percentage:', value.getUint8(0));
        document.querySelector('#value').innerHTML = value.getUint8(0);
  }).catch(exception => {
	document.querySelector('#data').innerHTML = "Error " + exception;
  }); 
});

const sendButton = document.querySelector('#send-button');
sendButton.addEventListener('click', function(){
  navigator.bluetooth.requestDevice({
    filters: [{
      services: ['c97433f0-be8f-4dc8-b6f0-5343e6100eb4']
    }]
  }).then(device => {
	console.log('Got device:', device.name);
	console.log('id:', device.id);
	return device.gatt.connect();
  }).then(server => server.getPrimaryService('c97433f0-be8f-4dc8-b6f0-5343e6100eb4'))
  .then(service => service.getCharacteristic('c97433f2-be8f-4dc8-b6f0-5343e6100eb4'))
  .then(characteristic => {
	const resetEnergyExpended = new Uint8Array([9]);
	// A value of `4` is a signal to reset it.
	return characteristic.writeValue(resetEnergyExpended);
  }).then(value => {
	console.log('Reset value of energy expended field');
        document.querySelector('#sendsuccess').innerHTML = "Successfully sent data";
  }).catch(exception => {
	console.log(exception);
        document.querySelector('#sendsuccess').innerHTML = "Error " + exception ;
  });
});

var controlData = new Uint8Array(2);
var y = 0;
controlData[0] = 1;
controlData[1] = 2;
const button = document.querySelector('#the-button');
button.addEventListener('click', function() {
  document.querySelector('#info').innerHTML = 'Connecting....';
  navigator.bluetooth.requestDevice({
        filters: [{
                services: ['c97433f0-be8f-4dc8-b6f0-5343e6100eb4']
        }]
  }).then(device => {
    document.querySelector('#data').innerHTML = 'Device Name ' + device.name;
    return device.gatt.connect();
  }).then(server => {
        console.log('Getting Remote Control Service…');
        return server.getPrimaryService('c97433f0-be8f-4dc8-b6f0-5343e6100eb4');
  }).then(service => service.getCharacteristic('c97433f2-be8f-4dc8-b6f0-5343e6100eb4'))
  .then(characteristic => {
        let setCha = characteristic; 
        for(c = 2; c < 8; c++){
        setTimeout(function(){
        var resetEnergyExpended = new Uint8Array([c]);
        // A value of `4` is a signal to reset it.
        setCha.writeValue(resetEnergyExpended);
        },3000);
        }
        //return 3;
  })/**.then(value => {
        console.log('Reset value of energy expended field');
        document.querySelector('#sendsuccess').innerHTML = "Successfully sent data";
  })*/.catch(exception => {
        document.querySelector('#data').innerHTML = "Error " + exception;
  });
});

function makeAdd(){
  y++;
  controlData[0] = y;
}

function handleReadDataCharacteristic(characteristic){
	console.log('Reading Control Value…');
	return characteristic.readValue()
	.then(value => {
	  value = value.buffer ? value : new DataView(value);
	  document.querySelector('#value').innerHTML = value.getUint8(0);
    }).catch(exception => {
	  console.log(exception);
    });
}

function handleWriteDataCharacteristic(characteristic){
	console.log('Writing Control Values');
	const control = new Uint8Array([6]);
	// A value of `1` is a signal to reset it.
	return characteristic.writeValue(control)
	.then(value => {
		console.log('Successfully sent the data....');
		document.querySelector('#info').innerHTML = "Data sent";
	}).catch(exception => {
		console.log(exception);
	});
}

function exOperation(){
	if(!chosenRemoteControlService){
		return Promise.reject(new Error('No heart rate sensor selected yet.'));
	}
	return Promise.all([
      service.getCharacteristic('c97433f1-be8f-4dc8-b6f0-5343e6100eb4')
        .then(handleReadDataCharacteristic),
      service.getCharacteristic('c97433f2-be8f-4dc8-b6f0-5343e6100eb4')
        .then(handleWriteDataCharacteristic),
    ]);
}
