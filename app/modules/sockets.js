var WebSocketServer = require('ws').Server;
var net=require('net');
var Server=require("./SocketServer.js");

module.exports={
	init:function(socketPort,tcpPort){
		
		var server=new Server;
		var socket = new WebSocketServer({ port:socketPort });
		
		//WebSocket Event handlers======================================================
		socket.on('connection', function conn(client) {
			console.log("Client connect on web sockets");
			client.api=server.interface();
			
			
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

		
		var tcpServer=net.createServer(function(socket) {
			//socket.write('Echo server\r\n');
			//socket.pipe(socket);
			//socket.write("ten");
			/*socket.on('connect',function(message){
				console.log("hak");


			});*/
			socket.api=server.interface();
			console.log("user connected on tcp line");
			socket.send=function(message){
				socket.write(message);
			}

			//when the relay server
			socket.on('data',function(message){ 
				//console.log(message.toString());
				
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
		
		console.log("server running on port "+socketPort);



		  //tcp socket event handlers===================================
		  //socket created for connecting to relay

		tcpServer.on('close',function(client){
			console.log("closing tcp");

		});

		tcpServer.listen(tcpPort);
		console.log("tcp listening on port "+tcpPort);
		
		return server;
	}	
}

