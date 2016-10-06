var socket=new WebSocket("ws://129.16.230.171:1337/script-games/server");

socket.onopen=function(e){
	console.log("Establishing contact");
	
};

socket.onmessage=function(e){
	
	var message=e.data.split("::");
	window[message[0]](message[1]);
};

socket.onclose=function(){
	console.log("quit");
};
