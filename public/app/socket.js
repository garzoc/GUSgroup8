var socket=new WebSocket("ws://127.0.0.1:8000/");

  socket.onopen=function(e){
    console.log("Establishing contact");
    socket.send('{"use":"initProcess","context":{"name" : "boo","type":"package"}}');

  };
  
  
socket.s=function(){
	this.send('{"ej":"jek"}');
}

socket.onmessage=function(e){
	
	console.log(e.data);
	var message=undefined;
	try{
		var message=JSON.parse(e.data);
	}catch(err){console.log(err);}
	
	if(message!==undefined){
		console.log(e.ej);
		//document.findElementById("places");
	}	
};

  socket.onclose=function(){
	console.log("Connection Closed");
	
}
