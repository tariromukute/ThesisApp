
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
		
      //inserting our stream to the video tag     
      //video.src = window.URL.createObjectURL(stream); 
   }, function (err) {}); 
	
} else { 
   alert("WebRTC is not supported"); 
}



var connection = new WebSocket('ws://localhost:8080');

var name = ""; 
 
var loginInput = document.querySelector('#loginInput'); 
var loginBtn = document.querySelector('#loginBtn'); 
var otherUsernameInput = document.querySelector('#otherUsernameInput'); 
var connectToOtherUsernameBtn = document.querySelector('#connectToOtherUsernameBtn'); 
var connectedUser, myConnection;
  
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
		
      myConnection = new webkitRTCPeerConnection(configuration); 
	myConnection.addStream(stream);
      console.log("RTCPeerConnection object was created"); 
      console.log(myConnection); 
  	  myConnection.onaddstream = onAddStreamHandler;
      //setup ice handling
      //when the browser finds an ice candidate we send it to another peer 
      myConnection.onicecandidate = function (event) { 
		
         if (event.candidate) { 
            send({ 
               type: "candidate", 
               candidate: event.candidate 
            }); 
         } 
      }; 
   } 
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
			
         myConnection.setLocalDescription(offer); 
      }, function (error) { 
         alert("An error has occurred."); 
      }); 
   } 
});

//when somebody wants to call us 
function onOffer(offer, name) {
   console.log("Offer has been received"); 
   connectedUser = name; 
   myConnection.setRemoteDescription(new RTCSessionDescription(offer)); 
	
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
   myConnection.setRemoteDescription(new RTCSessionDescription(answer)); 
} 
 
//when we got ice candidate from another user 
function onCandidate(candidate) { 
   console.log("Ice candidate Received");
   myConnection.addIceCandidate(new RTCIceCandidate(candidate)); 
}

//for adding stream
function onAddStreamHandler(evt) {
  video.src = URL.createObjectURL(evt.stream);
};	
