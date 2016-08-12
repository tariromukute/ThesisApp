
var stream;
var video;
  
function hasUserMedia() { 
   //check if the browser supports the WebRTC 
   return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || 
      navigator.mozGetUserMedia); 
} 
 
if (hasUserMedia()) {
   navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
      || navigator.mozGetUserMedia; 
		
   //enabling video and audio channels 
   navigator.getUserMedia({ video: true, audio: true }, function (s) { 
      stream = s; 
      video = document.querySelector('video'); 
		 
   }, function (err) {}); 
	
} else { 
   alert("WebRTC is not supported"); 
}



var connection = new WebSocket('wss://ec2-52-42-207-142.us-west-2.compute.amazonaws.com');

var name = ""; 
 
var loginInput = document.querySelector('#loginInput'); 
var loginBtn = document.querySelector('#loginBtn'); 
var otherUsernameInput = document.querySelector('#otherUsernameInput'); 
var connectToOtherUsernameBtn = document.querySelector('#connectToOtherUsernameBtn'); 
var msgInput = document.querySelector('#msgInput'); 
var sendMsgBtn = document.querySelector('#sendMsgBtn');
var dataChannelDisplay = document.querySelector('textarea#dataChannelDisplay');
var connectedUser, myConnection, dataChannel, icecandidate;
var remoteSet = false;
  
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
         onCandidate(data.candidate); 
         break; 
      case "test":
	 console.log("Success full test");
      default: 
         break; 
   } 
};

//when a user logs in 
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

	myConnection.addStream(stream);
      console.log("RTCPeerConnection object was created"); 
      console.log(myConnection); 
  	  myConnection.onaddstream = onAddStreamHandler;
      //setup ice handling
      //when the browser finds an ice candidate we send it to another peer 
	send({
	  type : "set connection",
	  data : "success"
	});
      myConnection.onicecandidate = function (event) { 
		
         if (event.candidate) { 
            send({ 
               type: "candidate", 
               candidate: event.candidate 
            }); 
         } 
      }; //onice
      
      openDataChannel();
	
	} //else
};
	  
connection.onopen = function () { 
   console.log("Connected");
};
  
connection.onerror = function (err) { 
   console.log("Got error", err); 
};
  
// Alias for sending messages in JSON format 
function send(message) { 

   if (connectedUser) { 
      message.name = connectedUser; 
		console.log("connectedUser here is : " + connectedUser);
	console.log("Sending to : " + connectedUser);
   } 

   connection.send(JSON.stringify(message)); 
};



//setup a peer connection with another user 
connectToOtherUsernameBtn.addEventListener("click", function () { 
 
   var otherUsername = otherUsernameInput.value; 
   connectedUser = otherUsername;
	console.log("connectedUser has been set to : " + otherUsername);
   if (otherUsername.length > 0) { 
      //make an offer 
      myConnection.createOffer(function (offer) { 
   	 console.log("Sending Offer....");
         console.log(); 
         send({ 
            type: "offer", 
            offer: offer 
         });
			
         myConnection.setLocalDescription(offer,
		function() {
		  console.log("setting local description");
		  send({
		    type : "set local dscr",
		    data : "the created offer"
		  });
		}, 
		function(error) { 
		  console.log(error);
		}
	); 
      }, function (error) { 
         alert("An error has occurred."); 
      }); 
   } 
});

//when somebody wants to call us 
function onOffer(offer, name) {
   console.log("Offer has been received"); 
   connectedUser = name; 
   myConnection.setRemoteDescription(new RTCSessionDescription(offer), 
		function() {
		  console.log("setting remote description");
		  send({
		    type : "set rmt dscrp",
		    data : icecandidate
		  });
		  remoteSet = true;
		  if(icecandidate){
		    setIceCandidate();
		  }
		}, 
		function(error) { 
		  console.log(error);
		}
	); 
	
   myConnection.createAnswer(function (answer) { 
      myConnection.setLocalDescription(answer); 
	
      send({ 
         type: "answer", 
         answer: answer 
      }); 
	console.log("answer has been sent back"); 	
   }, function (error) { 
      alert("oops...error"); 
   }); 
}
  
//when another user answers to our offer 
function onAnswer(answer) { 
   console.log("Offer has been answered");
   send({
     type : "received",
     data : "answer"
   });
   myConnection.setRemoteDescription(new RTCSessionDescription(answer), 
	function() {
	  console.log("setting remote description");
	  send({
	    type : "set rmt dscrp",
 	    data : "dont know"
	  });
	  remoteSet = true;
	  if(icecandidate){
	    setIceCandidate();
	  }
	}, 
	function(error) { 
	  send({
	    type : "failed rmt dscrp",
	    data : error
	  });
	  console.log(error);
	}
   ); 
} 
 
//when we got ice candidate from another user 
function onCandidate(candidate) { 
   //only do this when success to callback setRemoteDescription has returned
   //should implement the logic
   icecandidate = candidate;
   send({
     type : "received candidate",
     data : remoteSet
   });
   console.log("Ice candidate Received");
   if(remoteSet){
      setIceCandidate();
   }
}

function setIceCandidate(){
   console.log("Setting Ice candidate");
   send({
     type : "setting Ice",
     data : remoteSet
   });
   myConnection.addIceCandidate(new RTCIceCandidate(icecandidate)); 
}
//for adding stream
function onAddStreamHandler(evt) {
  if (video.mozSrcObject !== undefined) {
        video.mozSrcObject = stream;
    } else {
  	video.src = URL.createObjectURL(evt.stream);
  }
  video.onloadedmetadata = function(e) {
           video.play();
         };
};	



//creating data channel 
function openDataChannel() { 

   var dataChannelOptions = { 
      reliable:false 
   }; 
	
   
   dataChannel = myConnection.createDataChannel("myDataChannel", dataChannelOptions);
   myConnection.ondatachannel = receiveDataChannel;

   dataChannel.onopen = function (event) {
	  console.log("Data Channel Open");
	};

   dataChannel.onerror = function (error) { 
      console.log("Error:", error); 
   };

   dataChannel.onmessage = receiveDataChannelMessage;
}

function receiveDataChannel(event) {
	console.log("Receive Channel being set up");
        dataChannel = event.channel;
        dataChannel.onmessage = receiveDataChannelMessage;
}

function receiveDataChannelMessage(event) {
   console.log("Received message : " + event.data);
   dataChannelDisplay.value = event.data;
}
  
//when a user clicks the send message button 
sendMsgBtn.addEventListener("click", function (event) { 
   console.log("send message");
   var val = msgInput.value; 
   dataChannel.send(val); 
   console.log("sent data " + val);
});


