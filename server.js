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

//currently unused funcitons ============================================0

global.msg=function(where,object,client){
	//client.send(where+'::')
}


//interface functions=============================

global.cloneObject=function(obj){
	var clone=new Object;
	for(var k in obj){
		clone[k]=obj[k];
	}
	return clone; 
}

global.mergeObject=function mergeObject(a,b){
	for(var n in b){
		//console.log(n);
		if(a[n]===undefined){
			a[n]=b[n];
		}
	}
}

global.matchObject=function(a,b){
	
	for(var k in b){
		if(!a[k]===b[k])return false;
	}
	return true;
	
};

function jsonValueForm(value){
	if(isNaN(value)) return "\""+value+"\"";
	//console.log("sup");
	return value;
}

global.objectToString=function(obj){
	var string="";
	for(k in obj){
		//console.log(obj[k]);
		string=string.concat("\""+k+"\":"+jsonValueForm(obj[k])+",");
	}
	//console.log(string);
	return "{"+string.substr(0,string.length-1)+"}";
}


//console.log(global.objectToString({k:"va",l:10}));


global.setStaticFunction=function(func,client){
	console.log("niti");
	if(global.matchObject(client,server.processList[client.serverId].clients[client.localId])){
		console.log("success");
		server.processList[client.serverId].clients[client.localId].staticFunction=func;
	}else{
		console.log("fail");
	}
}

function verifiedClient(client){
	if(global.matchObject(client,server.processList[client.serverId].clients[client.localId])){	
		return true;
	}
	
	return false;
}

global.getClients=function(client){
	if(verifiedClient(client)){	
		return server.processList[client.serverId].clients;
	}else{
		console.log("failed modified client client");
	}
}

global.setVIP_user=function(client){
	if(verifiedClient(client)){	
		server.processList[client.serverId].clients[client.localId].isVIP=true;
	}else{
		console.log("failed modified client client");
	}
}

global.kickUser=function(client){
	if(verifiedClient(client)){	
		server.leaveProcess(client);
	}else{
		console.log("failed modified client client");
	}
}


/*var o={a:1};
var l={a:2,b:3};
mergeObject(o,l);*/
//console.log(l["a"]);


//configuration=============================================
var socketPort=8000;
var socket = new WebSocketServer({ port:socketPort });


var modPath="./app";
var newUserFunc="newUser";

var server={};
server.processList=[];
console.log("server running on port "+socketPort);
//server.clientsInProcess=[];



//module handlers=============================================
server.initProcess= function(context,client){
	//console.log(context.name);
	var newServerId=server.processList.length;
	
	
	server.processList.push(new Object);
	server.processList[newServerId].name=context.name;
	
	var process=server.processList[newServerId];
	process.clients=[client];
	client.localId=0;
	//console.log(server.processList.length+"  hello");

	try{
		if(client.serverId!=undefined)throw(error);
		client.serverId=newServerId;
		server.processList[newServerId].module=require(modPath+'/'+context.type+'.js');
		console.log("the module "+context.type+" is running smoothly on process "+ process.name);
		client.send('cnsl::{"msg":"successfully initiated process '+context.type+'!"}');
		client.inProcess=true;
	}
	catch(e){
		
			console.log("user already part of server");
			client.send('cnsl::{"msg":"process '+context.type+' does not exists"}');
			//client.send("serverMessages::You were kicked from the server");
			//server.leaveProcess(client);
			
	}
	
	if(typeof(server.processList[newServerId].module["init"]) === "function"){
		server.processList[newServerId].module["init"](global.cloneObject(client));
	}else{
		console.log("missing init funcion");
	}
	
}



server.joinProcess=function(context,client){
	//console.log(context.serverId);
	//console.log(server.processList.length);
	if(context.serverId<server.processList.length && server.processList.length>0){
		
		client.serverId=context.serverId;
		client.localId=server.processList[context.serverId].clients.length;
		server.processList[context.serverId].clients.push(client);
		console.log("new user joinned");
		client.send('cnsl::{"msg":"succefully joined process '+server.processList[context.serverId].name+'"}');
		if(typeof(server.processList[context.serverId].module[newUserFunc]) == "function"){
			server.processList[context.serverId].module[newUserFunc](global.cloneObject(client));
		}else{
			console.log("missing "+newUserFunc+" funcion");
		}
		
	}else{
		console.log("failed to join");
		client.send('cnsl::{"msg":"no server with that id"}');
	}
}


/*var k=["d","l","k"];
k.splice(1,1)
console.log(k);*/

server.leaveProcess=function(client){
	//console.log(client.serverId+ " ==================================================");
	if(client.serverId!=undefined){
		//console.log(client.serverId+"efnweoifnewfnwoeifnwenfwneinfwinfwenf");
		for (var i=client.localId;i<server.processList[client.serverId].clients.length;i++){
				server.processList[client.serverId].clients[i].localId--;
		}
		server.processList[client.serverId].clients.splice(client.localId+1,1);
		//console.log(server.processList[client.serverId].clients.splice(client.localId+1,1));

		if(server.processList[client.serverId].clients.length===0){
			console.log("closing server "+server.processList[client.serverId].name);
			 server.processList.splice(client.serverId,1);
		
			for(var i=client.serverId;i<server.processList.length;i++){
				for (var n=0;n<server.processList[i].clients.length;n++){
					server.processList[i].client[n].serverId--;	
				}
			}
		}else{
			if(typeof(server.processList[client.serverId].module["onClose"]) === "function"){
				client.localId++;
				client.verfication=global.cloneObject(server.processList[client.serverId].clients[0]);
				server.processList[client.serverId].module["onClose"](client);
			}else{
				console.log("missing onClose funcion");
			}
		}
		client.inProcess=undefined
		client.staticFunction=undefined;
		client.localId=undefined;
		client.serverId=undefined;
		client.verfication=undefined;
	}
	
	
}


server.listProcesses=function(client){
	var serverList=new Array;
	var name;
	for(var i=0;i<server.processList.length;i++){
		name=server.processList[i].name;
		serverList.push('{"name":"'+name+'","serverId":'+i+'}');

	}
	
	client.send('listing::{"list":'+serverList+'}');
}

/*
 * Event handlers for connections
 * 
 * */

//message processor==============================================0
server.decode=function(stringData){
	var buffer=stringData.split("::");
	var data={};
	//console.log(buffer.constructor===Array);
	//console.log(buffer);
	if(buffer.constructor===Array && buffer.length>1) {
		data.func=buffer[0];
		data.arg=JSON.parse(buffer[1]);
	}else{
		data.arg=JSON.parse(buffer);
	}
	return data;
}

server.msgRelay=function(message,client){
	var dir=server.decode(message.toString());
	
	//console.log(this.inProcess);
	
	if(!(client.inProcess===true)){
		server[dir.func](dir.arg,client);
	}else{
		if(client.staticFunction===undefined){
			server.processList[client.serverId].module[dir.func];
		}else{
			server.processList[client.serverId].module[client.staticFunction](dir.arg,client);
		}
	}
}






//Socket Event handlers======================================================
socket.on('connection', function conn(client) {
	console.log("Client connect");
	//var x="mud";
	//var y="dood";
	//client.send('log::{"Name":"'+x+'","Type":"'+y+'"}');
	
	client.on('message', function msg(message) {
		server.msgRelay(message,this);
	});
  
  client.on('close',function close(){
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





//tcp socket handlers===================================
var tcpServer=net.createServer(function(socket) {
	//socket.write('Echo server\r\n');
	//socket.pipe(socket);
	//socket.write("ten");
	/*socket.on('connect',function(message){
		console.log("hak");
		
	
	});*/
	console.log("user connected on tcp line");
	

	socket.on('data',function(message){	
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



tcpServer.on('close',function(client){
	console.log("majmaj");
	
});

tcpServer.listen(1337);
console.log("tcp listening on port 1337");




//var host=new Object;
//host.send=function(msg){console.log(msg)};
//var user=new Object;
//user.send=function(msg){console.log(msg)};
//server.initProcess({"name":"mooo","type":"webServ"},host);
//server.joinProcess({"serverId":"0"},user);

