/**
  Javascript test code for the Web Bluetooth API
*/


const button = document.querySelector('#the-button');
button.addEventListener('click', function() {
  document.querySelector('#info').innerHTML = 'Connecting....';
  navigator.bluetooth.requestDevice({
	filters: [{
		services: ['c97433f0-be8f-4dc8-b6f0-5343e6100eb4']
	}]
  }).then(device => {
    document.querySelector('#data').innerHTML = 'Device Name ' + device.name;
  }).catch(exception => {
	document.querySelector('#data').innerHTML = "Error " + exception;
  }); 
});
