var dict = {};
var express = require('express');
var app = express();
var WSS = require('ws').Server;

// Start the server
var wss = new WSS({ port: 8081 });

var path = require('path');

// Define the port to run on
app.set('port', 8080);

app.use(express.static(path.join(__dirname, 'public')));

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});



// When a connection is established
wss.on('connection', function(socket) {
	console.log('Opened connection ');
	
	// Send data back to the client
	var json = JSON.stringify({ 
		 type: "test", 
		 data: true 
	});
	socket.send(json);

	  
	//Message received
	socket.on('message', function(message){
		console.log(socket);		
		var data = JSON.parse(message);
		//console.log('Name parameter : ' + data.username);
		dict[data.username] = socket ;
		var response = JSON.stringify({ 
			 type: "login", 
			 data: true 
		});
		//console.log(dict);
		socket.send(response);

	});	


	
	
	// The connection was closed
	socket.on('close', function() {
		console.log('Closed Connection ');
	});

	
});

var received = function(message){
		console.log("received " + message);
		var js1 = JSON.stringify({ 
		 type: "test", 
		 data: true 
	});
		socket.send(js1);
	};

function sendData(data){
		console.log("sending data " + data);
		var js = JSON.stringify(data);
		socket.send(js); 
	};

var reply = function(){
	var ans = { 
		 type: "test", 
		 data: true 
      	}

	return ans;
};
//http://web-engineering.info/node/57
