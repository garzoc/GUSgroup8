module.exports = function(){
  //configuration=============================================

  var modPath="./app";
  var newUserFunc="newUser";


  //GLOBAL functions
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



  server.processList=[];
  console.log("server running on port "+socketPort);
  //server.clientsInProcess=[];



  //module handlers=============================================
  this.initProcess= function(context,client){
  	//console.log(context.name);


  	//console.log(server.processList.length+"  hello");

  	try{
  		if(client.serverId!=undefined)throw("user already subscribed to module");
  			var newServerId=server.processList.length;
  			server.processList.push(new Object);
  			server.processList[newServerId].name=context.name;
  			var process=server.processList[newServerId];
  			process.clients=[client];
  			client.localId=0;
  			client.serverId=newServerId;
  			server.processList[newServerId].module=require(modPath+'/'+context.type+'.js');
  			console.log("the module "+context.type+" is running smoothly on process "+ process.name);
  			client.send('cnsl::{"msg":"successfully initiated process '+context.type+'!"}');
  		client.inProcess=true;
  	}
  	catch(e){

  			console.log(e);
  			client.send('cnsl::{"msg":"process '+context.type+' does not exists"}');
  			//client.send("serverMessages::You were kicked from the server");
  			//server.leaveProcess(client);

  	}

  	if(server.processList[newServerId].module!==undefined&&typeof(server.processList[newServerId].module["init"]) === "function"){
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
  	var packetStruct=stringData.split("::");
  	var data={};
  	//console.log(buffer.constructor===Array);
  	//console.log(buffer);
  	if(packetStruct.constructor===Array && packetStruct.length>1) {
  		data.func=packetStruct[0];
  		data.arg=JSON.parse(packetStruct[1]);
  	}else{
  		var packetData=packetStruct[0];//string made up of several json obejcts
  		buffer=packetData.split("}{");
  		if(buffer.constructor===Array && buffer.length>1){
  			//console.log(packetData+"    god natt=====================================0");
  			data.arg=[];
  			data.arg.push(buffer[0]+"}");
  			for(var i=1;i<buffer.length-1;i++){
  				data.arg.push("{"+buffer[i]+"}");
  			}
  			data.arg.push("{"+buffer[buffer.length-1]);
  			//console.log(data.arg[0]+"    god natt");

  			if(packetData.substr(0,1)!=="{"){
  				data.arg.splice(0,1);
  			}
  			if(packetData.substr(packetData.length-1,packetData.length)!=="}"){
  				data.arg.splice(data.arg.length-1,1);
  			}

  		}else{
  			data.arg=JSON.parse(buffer);
  		}
  	}

  	return data;
  }


  //relay messages to modules
  server.msgRelay=function(message,client){
  	var dir;
  	try{
  		dir=server.decode(message.toString())
  	}catch(err){
  		console.log(err);
  		dir=null;
  	}
  	if(dir===null)return null;
  	//console.log(this.inProcess);



  	if(!(client.inProcess===true)){
  	server[dir.func](dir.arg,client);
  	}else{
  		if(client.staticFunction===undefined){
  			server.processList[client.serverId].module[dir.func](dir.arg,global.cloneObject(client));
  		}else{
  			console.log(dir.arg+"    god natt");
  			server.processList[client.serverId].module[client.staticFunction](dir.arg ,global.cloneObject(client));
  		}
  	}
  }
}
