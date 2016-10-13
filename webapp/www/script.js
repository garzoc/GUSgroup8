window.onload = function() {
     document.getElementById('Connect-Button').onclick=connectToNodeJS;
}


function connectToNodeJS() {
  document.getElementById('Connect-Button').innerHTML='Please wait';
  var socket=new WebSocket("ws://129.16.230.180:8000/");

  socket.onopen=function(e){
  	console.log("Establishing contact");
    document.getElementById('Connect-Button').innerHTML='Connection Successful';
  };

  socket.onmessage=function(e){
  	var message=e.data;
    console.log(message);
  	//window[message[0]](message[1]);

  };

  socket.onclose=function(){
  	console.log("quit");
    document.getElementById('Connect-Button').innerHTML='Connection Unsuccessful';
  };


}

function displayJSONObject(receive) {
  var obj = JSON.parse(receive);
  document.getElementById('Sensor-ID').innerHTML=obj.id;
  document.getElementById('Sensor-Value').innerHTML=obj.value;
  document.getElementById('Time-Stamp').innerHTML=obj.time;
}
