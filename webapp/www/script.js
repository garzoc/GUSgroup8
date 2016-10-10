window.onload = function() {
     document.getElementById('Connect-Button').onclick=connectToNodeJS;
     document.getElementById('Display-JSON').onclick=createJSONObject;
}


function connectToNodeJS() {
  document.getElementById('Connect-Button').innerHTML='Please wait';
  var socket=new WebSocket("ws://localhost:8080/");

  socket.onopen=function(e){
  	console.log("Establishing contact");
    document.getElementById('Connect-Button')='Connection Successful';
  };

  socket.onmessage=function(e){
  	var message=e.data.split("::");
  	window[message[0]](message[1]);
  };

  socket.onclose=function(){
  	console.log("quit");
    document.getElementById('Connect-Button').innerHTML='Connection Unsuccessful';
  };


}

function createJSONObject(receive) {
  var obj = JSON.parse(receive);
}
