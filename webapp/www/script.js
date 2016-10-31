
  var socket=new WebSocket("ws://129.16.228.67:8000/"); 
 
  socket.onopen=function(e){ 
    console.log("Establishing contact"); 

  }; 
 
  socket.onmessage=function(e){ 
    var message=e.data.split("::"); 
    window[message[0]](JSON.parse(message[1])); 
    var message=e.data; 
    
    
  }; 
 
  socket.onclose=function(){
	console.log("Connection Closed");
}

 function log(receive) {
	console.log(receive);
	var jsonobj = JSON.parse(receive);
	console.log(jsonobj.Name);
	console.log(jsonobj.Type);
}

function cnsl(receive) {
	console.log(receive.msg);
}