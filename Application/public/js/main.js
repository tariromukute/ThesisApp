
var loginInput = document.querySelector('#loginInput'); 
var loginBtn = document.querySelector('#loginBtn'); 
var otherUsernameInput = document.querySelector('#otherUsernameInput'); 
var connectToOtherUsernameBtn = document.querySelector('#connectToOtherUsernameBtn'); 

var dataChannelDisplay = document.querySelector('#dataChannelDisplay');
var dataChannelDisplay2 = document.querySelector('#dataChannelDisplay2');
var connectedUser, myConnection, dataChannel, dataChannel2, icecandidate;
var stream , video , name;
var remoteSet = false;

var connection = new WebSocket('wss://ec2-52-42-207-142.us-west-2.compute.amazonaws.com');

//var connection = new WebSocket('wss://localhost:8080');

function hasUserMedia() { 
   //check if the browser supports the WebRTC 
   return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || 
      navigator.mozGetUserMedia); 
} 
 
if (hasUserMedia()) {
console.log("Browseer supports media devices");
   navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
      || navigator.mozGetUserMedia; 
		
   //enabling video and audio channels 
   /**
   navigator.getUserMedia({ video: true, audio: true }, function (s) { 
      stream = s; 
      video = document.querySelector('video'); 
		 
   }, function (err) {}); 
   */
    var constraints = { audio: true, video : true /*video: { width: 1280, height: 720 }*/ }; //might need to set the resolution
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(s) {
	console.log("Setting Stream");
	stream = s;  	
	video = document.querySelector('#livestream');
    
    })
    .catch(function(error) {
  	console.log("Got an error : " + error);
    });
	
} else { 
   alert("WebRTC is not supported"); 
}



//for the socket connection
connection.onopen = function(){
    console.log("Connected");
}

connection.onerror = function(error){
    console.log("Got error ", error); 
}

//handle messages from the server 
connection.onmessage = function (message) { 
   console.log("Got message", message.data);
   var data = JSON.parse(message.data); 
	
   switch(data.type) { 
      case "login": 
         onLogin(data.success); 
         break; 
      case "offer": 
         onOffer(data.offer, data.from); 
         break; 
      case "answer": 
         onAnswer(data.answer); 
         break; 
      case "candidate": 
         onIceCandidate(data.candidate); 
         break; 
      case "test":
	 console.log("Success full test");
      default: 
         break; 
   } 
};

function send(message){
    if (connectedUser) { 
        message.name = connectedUser; 
	console.log("connectedUser here is : " + connectedUser);
	console.log("Sending to : " + connectedUser);
    } 

    connection.send(JSON.stringify(message));
} 


function onLogin(success) { 

    if (success === false) { 
	alert("oops...try a different username"); 
    } else { 
	//creating our RTCPeerConnection object 
	
	var configuration = { 
	    "iceServers": [{ "url": "stun:stun.1.google.com:19302" }] 
	}; 
	
	myConnection = new RTCPeerConnection(configuration, {
	    optional : [{DtlsSrtpKeyAgreement:true}]
	}); 

	//dataChannel = myConnection.createDataChannel("my channel");
	//check which browser is being used. There must be a better way	
	if (navigator.mozGetUserMedia && window.mozRTCPeerConnection) {
	    stream.getTracks().forEach(track => myConnection.addTrack(track, stream));
	} else{
	    myConnection.addStream(stream);
	}
	
	console.log("RTCPeerConnection object was created"); 
	console.log(myConnection); 
	myConnection.onaddstream = onAddStream;
	
	//setup ice handling
	//when the browser finds an ice candidate we send it to another peer 
	send({
	    type : "set connection",
	    data : "success"
	});

	myConnection.onicecandidate = function (event) { 
	
	    if (event.candidate) {
		console.log("Sending candidate"); 
	        send({ 
	            type: "candidate", 
	            candidate: event.candidate 
	        }); 
	    } 
	}; //onice

	createDataChannel();

    } //else
};


//Step One : for the caller
function createOffer(){
//called when a 'call' button is clicked
    
    //create an offer

    //set the local descriptor

    //send offer
    myConnection.createOffer().then(function(offer) {
	console.log("Creating offer");
	//setLocalDescription without success/failure callback is deprecated in Firefox
        return myConnection.setLocalDescription(offer, function(){
	    	console.log("Successfully set local description");
	    } , function(error){
		console.log("An error has occured : " + error);
	    });
    })
    .then(function() {
	console.log("Sending offer");
        send({
            type : "offer",
	    offer : myConnection.localDescription
        });
    })
    .catch(function(error) {
        // An error occurred, so handle the failure to connect
    });
}

//Step Two : for the callee
function onOffer(offer, name){
    //set remote descriptor

    //create an answer

    //set local descriptor using the created answer

    //send answer

    //enable ice to be added
    connectedUser = name;
    myConnection.setRemoteDescription(new RTCSessionDescription(offer), function(){
	    console.log("Successful set local description");
	} , function(error){
	    console.log("An error has occured : " + error);
	}
    ).then(function () {
	console.log("Setting the remote description");
        return myConnection.createAnswer();
    })
    .then(function (answer) {
	console.log("Setting the local description");
        return myConnection.setLocalDescription(answer, function(){
	    	console.log("Successfully set local description");
	    } , function(error){
		console.log("An error has occured : " + error);
	    });
    })
    .then(function () {
	console.log("Sending an answer");
        send({
	    type : "answer",
	    answer : myConnection.localDescription
	});
	if(icecandidate){
	    addIceCandidate();
	}	
	remoteSet = true;
    })
    .catch(function(error){
    
    });
}

//Step Three : for caller
function onAnswer(answer){
    //set remote descriptor

    //enable ice to be added
    console.log("Receiving answer");
    send({
	type : "Received",
	data : "Answer"
    });
    myConnection.setRemoteDescription(new RTCSessionDescription(answer), function(){
    	    console.log("Successful set local description");
	    send({
		type : "Successful",
		data : "Remote Descrp for answer"
	    });
	} , function(error){
	    console.log("An error has occured : " + error);
	    send({
		type : "Failed",
		data : error
	    });
	}
    )
    .catch(function(error){
	
    });
    if(icecandidate){
	addIceCandidate();
    }	
    remoteSet = true;
}

function onIceCandidate(candidate){
    //set the global icecandidate variable

    //check if remote descriptor has been set, if set call addIceCandidate
    console.log("Received ice candidate");
    icecandidate = candidate;
    if(remoteSet){
	addIceCandidate();
    }
}


function addIceCandidate(){
    console.log("Adding ice candidate");
    myConnection.addIceCandidate(new RTCIceCandidate(icecandidate)); 
    changeScreen();
}

function onAddStream(event){
    if (video.mozSrcObject !== undefined) {
        video.mozSrcObject = stream;
    } else {
  	video.src = URL.createObjectURL(event.stream);
    }
    video.onloadedmetadata = function(e) {
   	video.play();
    };
}

function createDataChannel(){
    var dataChannelOptions = { 
      	reliable:false 
    }; 
	
   
   dataChannel = myConnection.createDataChannel("myDataChannel", dataChannelOptions);
   dataChannel2 = myConnection.createDataChannel("myDataChannel2", dataChannelOptions);
   myConnection.ondatachannel = onDataChannel;

   dataChannel.onopen = function (event) {
	console.log("Data Channel Open");
   };

   dataChannel.onerror = function (error) { 
      	console.log("Error:", error); 
   };

   dataChannel.onmessage = onDataChannelMessage;
   
   

   dataChannel2.onopen = function (event) {
	console.log("Data Channel Open");
   };

   dataChannel2.onerror = function (error) { 
      	console.log("Error:", error); 
   };

   dataChannel2.onmessage = onDataChannelMessage;
}

function onDataChannel(event){
    console.log("Receive Channel being set up");
    if(event.channel.label == "myDataChannel"){
    	dataChannel = event.channel;
	dataChannel.onmessage = onDataChannelMessage;
    }
    else if(event.channel.label == "myDataChannel2"){
	dataChannel2 = event.channel;
	dataChannel2.onmessage = onDataChannelMessage2;
    }
}

function onDataChannelMessage(event){
    console.log("Received message : " + event.data);
    dataChannelDisplay.value = event.data;
}

function onDataChannelMessage2(event){
    console.log("Received message : " + event.data);
    dataChannelDisplay2.value = event.data;
}

//when a user clicks the login button 
loginBtn.addEventListener("click", function(event){ 
   name = loginInput.value; 
	      console.log("Login button clicked");
   if(name.length > 0){ 
      send({ 
         type: "login", 
         name: name 
      }); 
   } 
	
});

//setup a peer connection with another user 
connectToOtherUsernameBtn.addEventListener("click", function () { 
 
   var otherUsername = otherUsernameInput.value; 
   connectedUser = otherUsername;
	console.log("connectedUser has been set to : " + otherUsername);
   if (otherUsername.length > 0) { 
      //make an offer 
      createOffer(); 
   } 
});


function message(message){
  dataChannel.send(message); 
}

function message2(message){
  dataChannel2.send(message); 
}

