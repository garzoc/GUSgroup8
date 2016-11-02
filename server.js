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

//modules ==============================================
var WebSocketServer = require('ws').Server;
var net=require('net');

//tcp socket handlers===================================
var tcpServer=net.createServer(function(socket) {
	//socket.write('Echo server\r\n');
	//socket.pipe(socket);
	//socket.write("ten");
	
	socket.on('data',function(message){
		
		this.send=function(message){
			this.write(message);
		}
		var dir=server.decode(message.toString());
		console.log(this.inProcess);
		if(!(this.inProcess===true)){
			
			server[dir.path](dir.arg,this);
		}else{
			if(this.permFunc===undefined){
				server.callProcess(dir,this);
			}else{
				server.processList[this.serverId].module[this.permFunc](dir.arg,this);
			}
		}
	});
	
	socket.on('close',function(n){
		console.log("user left");
		server.leaveProcess(this);
		
	});
	//tcpServer.close();
	//console.log("hello");
});



tcpServer.on('close',function(client){
	console.log("majmaj");
	
});

tcpServer.listen(1337);
console.log("tcp listening on port 1337");







//configuration=============================================
var socketPort=8000;
var socket = new WebSocketServer({ port:socketPort });
var server={};
server.processList=[];
console.log("server running on port "+socketPort);

var modPath="./app";
var newUserFunc="newUser";
//server.clientsInProcess=[];


server.callProcess=function(context,client){
}


//process handlers=============================================
server.initProcess= function(context,client){
	console.log("hej");
	var newServerId=server.processList.length;
	client.serverId=newServerId;
	
	server.processList.push(new Object);
	server.processList[newServerId].name=context.name;
	
	var process=server.processList[newServerId];
	process.clients=[client];
	console.log(server.processList.length+"  hello");

	try{
		if(client.serverID!=undefined)throw(error);
		server.processList[newServerId].module=require(modPath+'/'+context.type+'.js');
		console.log("the module"+context.type+" is running smoothly on process "+ process.name);
		client.send('cnsl::{"msg":"successfully initiated process '+context.type+'!"}');
		client.inProcess=true;
	}
	catch(e){
		
			console.log(e);
			client.send('cnsl::{"msg":"process '+context.type+' does not exists"}');
			//client.send("serverMessages::You were kicked from the server");
			//server.leaveProcess(client);
			
	}
	
	if(typeof(server.processList[newServerId].module["init"]) == "function"){
		server.processList[newServerId].module["init"](client);
	}else{
		console.log("missing init funcion");
	}
	
}

server.joinProcess=function(context,client){
	console.log(context.serverId);
	console.log(server.processList.length);
	if(context.serverId<server.processList.length && server.processList.length>0){
		
		client.serverId=context.serverId;
		server.processList[context.serverId].clients.push(client);
		console.log("new user joinned");
		client.send('cnsl::{"msg":"succefully joined process '+server.processList[context.serverId].name+'"}');
		if(typeof(server.processList[context.serverId].module[newUserFunc]) == "function"){
			server.processList[context.serverId].module[newUserFunc](client);
		}else{
			console.log("missing "+newUserFunc+" funcion");
		}
	}else{
		console.log("failed to join");
		client.send('cnsl::{"msg":"no server with that id"}');
	}
}

server.leaveProcess=function(client){
	if(client.serverId){
		//console.log(client.id);
		if(server.processList[client.serverId].clients.length==0) server.processList.splice(client.serverId,1);
		for(var i=client.serverId;i<server.processList.length;i++){
			for (var n=0;n<server.processList[i].clients.length;n++){
				server.processList[i].client[n].serverId--;	
			}
		}
	}
	client=undefined;
}

server.listProcess=function(client){
	
}

/*
 * Event handlers for connections
 * 
 * */

//message processor==============================================0
server.decode=function(stringData){
	var buffer=stringData.split("::");
	var path={};
	//console.log(buffer.constructor===Array);
	//console.log(buffer);
	if(buffer.constructor===Array && buffer.length>1) {
		//console.log("tjenare");
		path.path=buffer[0];
		path.arg=JSON.parse(buffer[1]);
	}else{
		path.arg=JSON.parse(buffer);
	}
	
	return path;
	
}

//Socket Event handlers======================================================
socket.on('connection', function conn(client) {
	console.log("Client connect");
	//var x="mud";
	//var y="dood";
	//client.send('log::{"Name":"'+x+'","Type":"'+y+'"}');
	
	client.on('message', function msg(message) {
		var dir=server.decode(message.toString());
		server[dir.path](dir.arg,this);
		//this.send(message);
	});
  
  client.on('close',function close(client){
	  server.leaveProcess(client);
	});
	
	
});

socket.on('close', function close() {
	console.log("shuting down servers");	
	socket.clients.foreach(function every(client){
		client.send("closing server");
	});
 
});

//var host=new Object;
//host.send=function(msg){console.log(msg)};
//var user=new Object;
//user.send=function(msg){console.log(msg)};
//server.initProcess({"name":"mooo","type":"webServ"},host);
//server.joinProcess({"serverId":"0"},user);

