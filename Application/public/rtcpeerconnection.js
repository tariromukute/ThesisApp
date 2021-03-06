var localVideoElem = null, remoteVideoElem = null, localVideoStream = null,
    videoCallButton = null, endCallButton = null,
    peerConn = null, wsc = new WebSocket('ws://localhost:9090'),
    peerConnCfg = {'iceServers': 
      [{'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]
    };


function hasUserMedia() { 
   //check if the browser supports the WebRTC 
   return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || 
      navigator.mozGetUserMedia); 
} 

function pageReady() {
  videoCallButton = document.getElementById("videoCallButton");
  endCallButton = document.getElementById("endCallButton");
  localVideo = document.getElementById('localVideo');
  remoteVideo = document.getElementById('remoteVideo');
  // check browser WebRTC availability 
  if(hasUserMedia()) {
    videoCallButton = document.getElementById("videoCallButton");
    endCallButton = document.getElementById("endCallButton");
    localVideo = document.getElementById('localVideo');
    remoteVideo = document.getElementById('remoteVideo');
    videoCallButton.removeAttribute("disabled");
    videoCallButton.addEventListener("click", initiateCall);
    endCallButton.addEventListener("click", function (evt) {
      wsc.send(JSON.stringify({"closeConnection": true }));
    });
  } else {
    alert("Sorry, your browser does not support WebRTC!")
  }
};



wsc.onmessage = function (evt) {
  var signal = JSON.parse(evt.data);
  if (!peerConn)
    answerCall();

  if (signal.sdp) {
    peerConn.setRemoteDescription(new RTCSessionDescription(signal.sdp));
  } else if (signal.candidate) {
    peerConn.addIceCandidate(new RTCIceCandidate(signal.candidate));
  } else if (signal.closeConnection){
      endCall();
  }
};



function initiateCall() {
  prepareCall();
  navigator.getUserMedia({ "audio": true, "video": true }, function (stream) {
    localVideo.src = URL.createObjectURL(stream);
    peerConn.addStream(stream);
    createAndSendOffer();
  }, function(error) { console.log(error);});
};




function prepareCall() {
  peerConn = new RTCPeerConnection(peerConnCfg);
  peerConn.onicecandidate = onIceCandidateHandler;
  peerConn.onaddstream = onAddStreamHandler;
};

function onIceCandidateHandler(evt) {
  if (!evt || !evt.candidate) return;
  wsc.send(JSON.stringify({"candidate": evt.candidate }));
};

function onAddStreamHandler(evt) {
  videoCallButton.setAttribute("disabled", true);
  endCallButton.removeAttribute("disabled"); 
  remoteVideo.src = URL.createObjectURL(evt.stream);
};



function createAndSendOffer() {
  peerConn.createOffer(
    function (offer) {
      var off = new RTCSessionDescription(offer);
      peerConn.setLocalDescription(new RTCSessionDescription(off), 
        function() {
          wsc.send(JSON.stringify({"sdp": off }));
        }, 
        function(error) { 
          console.log(error);
        }
      );
    }, 
    function (error) { 
      console.log(error);
    }
  );
};




function answerCall() {
  prepareCall();
  // get the local stream, show it in the local video element and send it
  navigator.getUserMedia({ "audio": true, "video": true }, function (stream) {
    localVideo.src = URL.createObjectURL(stream);
    peerConn.addStream(stream);
    createAndSendAnswer();
  }, function(error) { console.log(error);});
};




function createAndSendAnswer() {
  peerConn.createAnswer(
    function (answer) {
      var ans = new RTCSessionDescription(answer);
      peerConn.setLocalDescription(ans, function() {
          wsc.send(JSON.stringify({"sdp": ans }));
        }, 
        function (error) { 
          console.log(error);
        }
      );
    },
    function (error) { 
      console.log(error);
    }
  );
}




function endCall() {
  peerConn.close();
  localVideoStream.getTracks().forEach(function (track) {
    track.stop();
  });
  localVideo.src = "";
  remoteVideo.src = "";
  videoCallButton.removeAttribute("disabled");
  endCallButton.setAttribute("disabled", true);
};


