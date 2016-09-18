var clients = {};
var express = require('express');
var app = express();
var WSS = require('ws').Server;

var fs = require("fs");
var https = require('https');

var path = require('path');

// Define the port to run on
app.set('port', 8080);

app.use(express.static(path.join(__dirname, 'public')));

//should be put in a config file, along with some necessary/security configurations
var key = fs.readFileSync(path.resolve(__dirname, 'cert/key.pem'));
var cert = fs.readFileSync(path.resolve(__dirname, 'cert/cert.pem'));


var server = https.createServer({
      key: key,
      cert: cert
    }, app).listen(app.get('port'));

var wss = new WSS({server: server});





// When a connection is established
wss.on('connection', function(socket) {
	console.log('Opened connection ');
	socket.id = "012230";
	
	console.log("socket id = " + socket.id);
	// Send data back to the client
	var json = JSON.stringify({ 
		 type: "test", 
		 data: true 
	});
	socket.send(json);

	//Message received
	socket.on('message', function(message){	
		console.log("Received message for : " + message);
		var data = JSON.parse(message);
		console.log('Name parameter : ' + data.type);
		switch(data.type) { 
			case "login": 
			 var response = JSON.stringify({ 
				 type: "login", 
				 data: true 
			 });
			 socket.username = data.name;
			 clients[socket.username] = socket;
			 clients[data.name].send(response); 
			 //console.log(clients[data.username]);
			 break; 
			case "offer": 
			 var name = data.name; 
			 data.from = socket.username;
			 var msg = JSON.stringify(data);
			 console.log("the new message name is : " + msg);
			 clients[name].send(msg);
			 break; 
			case "answer": 
			 clients[data.name].send(message);
			 break; 
			case "candidate": 
			 clients[data.name].send(message);
			 break; 
			case "test":
			 console.log("Success full test");
			default: 
			 break; 
		}
 
		
		console.log("socket username = " + socket.username);		
		

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