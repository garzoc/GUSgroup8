/*
 * Packet and variable Declaration for those packets
 * 
 * */
 

/*
 * MQTT Client
 * */

var mqtt = require('mqtt');
var mqttClient  = mqtt.connect('mqtt://broker.hivemq.com');

/*
 * MQTT Client
 * */
mqttClient.on('connect', function () {
  mqttClient.subscribe('group8');
  //mqttClient.publish('group8', 'Hello mqtt');
});
 
mqttClient.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString());
  
	socket.clients.forEach(function each(client) {
		client.send(message.toString());
	});
	//mqttClient.end();
});


var net=require('net');
var tcpServer=net.createServer(function(socket) {
	//socket.write('Echo server\r\n');
	//socket.pipe(socket);
	//socket.write("ten");
	socket.on('data',function(data){
		console.log("hell yee");
	});
	
	socket.on('close',function(n){
			console.log("error");
		
	});
	//tcpServer.close();
	console.log("hello");
});



tcpServer.on('close',function(client){
	console.log("majmaj");
	
});

tcpServer.listen(1337);








/*
 * NodeJs server
 * 
 * */

var WebSocketServer = require('ws').Server;
var socketPort=8000;
var socket = new WebSocketServer({ port:socketPort });
console.log("server running on port "+socketPort);

var modPath="./mods";
var server={};
server.processList=[];
//server.clientsInProcess=[];

server.callProcess=function(context,client){
		/*if(typeof(global.gameServers[client.serverId].gameMode[data[0]]) == "function"){
		global.gameServers[client.serverId].gameMode[data.shift()](data,client);
	}else{
		console.log("Function with name "+data[0]+" does not exists");
	}*/
	
}

server.initProcess= function(context,client){
	var newServerId=server.processList.length;
	client.serverId=newServerId;
	
	server.processList.push({});
	server.processList[newServerId].name=context.name;
	
	var process=server.processList[newServerId];
	process.clients=[client];
	
	//client.id=server.clientsInProcess.length();
	//server.clientsInProcess.push(client);
	
	try{
		if(client.serverID!=undefined)throw(error);
		server.processList[newServerId].mod=require(modPath+'/'+context.type+'.js');
		console.log("the mod "+context.type+" is running smoothly on server "+ client.serverId);
		client.send('cnsl::{"msg":"successfully initiated process '+context.type+'!"}');
	}
	catch(e){
		
			console.log(e);
			client.send('cnsl::{"msg":"process '+context.type+' does not exists"}');
			//client.send("serverMessages::You were kicked from the server");
			//server.leaveProcess(client);
			
	}
	
}

server.joinProcess=function(){
	
}

server.leaveProcess=function(client){
	
}

server.listProcess=function(client){
	
}

/*
 * Event handlers for connections
 * 
 * */
server.decode=function(stringData){
	var buffer=stringData.split("::");
	var path={};
	path.path=buffer[0];
	path.arg=JSON.parse(buffer[1]);
	return path;
}

socket.on('connection', function conn(client) {
	console.log("Client connect");
	//var x="mud";
	//var y="dood";
	//client.send('log::{"Name":"'+x+'","Type":"'+y+'"}');
	
	client.on('message', function msg(message) {
		var dir=server.decode(message);
		server[dir.path](dir.arg,this);
		//this.send(message);
	});
  
  client.on('close',function close(client){
		if(client.id){
			console.log(client.id);
			if(server.processList[i].clients.length==0) server.processList.splice(client.serverId,1);
		
			for(var i=client.serverId;i<server.processList.length;i++){
				for (var n=0;n<server.processList[i].clients.length;n++){
					server.processList[i].client[n].serverId--;	
				}
			}
		}
	  
	});
});

socket.on('close', function close() {
	console.log("shuting down servers");	
	socket.clients.foreach(function every(client){
		client.send("closing server");
	});
 
});
