

var socket=new WebSocket("ws://172.20.10.3:8000/");
 
  socket.onopen=function(e){ 
    console.log("Establishing contact");
    socket.send('joinProcess::{"serverId" : 0}');

  }; 
 
  socket.onmessage=function(e){
    var message=e.data.split("::"); 
    console.log(message);
    window[message[0]](JSON.parse(message[1])); 
    var message=e.data; 
    
    
  }; 
 
  socket.onclose=function(){
	console.log("Connection Closed");
	document.getElementById("humidity-label").innerHTML = "Not available";
}

 function log(receive) {
	console.log(receive);
}

function cnsl(receive) {
	console.log("cnsl : " + receive.id);
	if (receive.id === "humidity") {
	document.getElementById("humidity-label").innerHTML = receive.value + '%';
}
}

function joinProcess(receive) {
	console.log(receive.id);
}

function closeSckt(receive) {
	socket.close();
}


part1::part2