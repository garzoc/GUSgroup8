var WebSocketServer = require('ws').Server;
var net=require('net');
///var require socketserver.js

//WebSocket Event handlers======================================================
socket.on('connection', function conn(client) {
	console.log("Client connect");
	//var x="mud";
	//var y="dood";
	//client.send('log::{"Name":"'+x+'","Type":"'+y+'"}');

	client.on('message', function msg(message) {
		server.msgRelay(message,this);
	});

  client.on('close',function close(){
	  //console.log("closingf");
	  server.leaveProcess(this);
	  //this=undefined;
	});


});

socket.on('close', function close() {
	console.log("shuting down servers");
	socket.clients.foreach(function every(client){
		client.send("closing server");
	});

});

var socketPort=8000;
var socket = new WebSocketServer({ port:socketPort });


var tcpServer=net.createServer(function(socket) {
	//socket.write('Echo server\r\n');
	//socket.pipe(socket);
	//socket.write("ten");
	/*socket.on('connect',function(message){
		console.log("hak");


	});*/
	console.log("user connected on tcp line");

	//when the relay server
	socket.on('data',function(message){ ///
		this.send=function(message){
			this.write(message);
		}
		//console.log(message.toString()+"    =============================================");
		server.msgRelay(message,this);

	});

	socket.on('close',function(n){
		console.log("user left");
		server.leaveProcess(this);

	});
	//tcpServer.close();
	//console.log("hello");
});




  //tcp socket event handlers===================================
  //socket created for connecting to relay

tcpServer.on('close',function(client){
	console.log("closing tcp");

});

tcpServer.listen(1337);
console.log("tcp listening on port 1337");
