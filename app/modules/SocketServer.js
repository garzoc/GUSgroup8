
var json=require("./jsonObj");

module.exports = function(){
	//configuration=============================================

	var modPath="";
	var newUserFunc="newUser";
	processList=[];
	var interface={
		getClients:function(client){
			if(verifiedClient(client)){
				return processList[client.serverId].clients;
			}else{
				console.log("failed modified client client");
			}
			updateClient(client);
		},
	

		setVIP_user:function(client){
			if(verifiedClient(client)){
				processList[client.serverId].clients[client.localId].isVIP=true;
			}else{
				console.log("failed modified client client");
			}
			updateClient(client);
		},

		kickUser:function(client){
			if(verifiedClient(client)){
				server.leaveProcess(client);
			}else{
				console.log("failed modified client client");
			}
			updateClient(client);
		},

		setStaticFunction:function(func,client){
			//console.log("niti");
			if(verifiedClient(client)){
				//console.log("success");
				processList[client.serverId].clients[client.localId].staticFunction=func;
			}else{
				console.log("failed modified client client");
			}
			updateClient(client);
		},
		
		//dagerous allowing users to create functions will compromise data may work if only allowed to store variables
		/*add_custom_attribute:function(name,value,client){
			//console.log("niti");
			if(verifiedClient(client)){
				//console.log("success");
				processList[client.serverId].clients[client.localId].attribute[name]=value;
			}else{
				console.log("failed modified client client");
			}
			updateClient(client);
		}*/
		
    };
    
    function updateClient(client){
    	client=json.overwriteObject(client,processList[client.serverId].clients[client.localId]);
    }

	function verifiedClient(client){
    	if(json.matchObject(client,processList[client.serverId].clients[client.localId])){
    		return true;
    	}

    	return false;
    }
    
    

	
  //server.clientsInProcess=[];



  //module handlers=============================================
	this.initProcess= function(context,client){
  	console.log(context.name);

	
  	//console.log(server.processList.length+"  hello");

		try{
			if(client.serverId!=undefined)throw("user already subscribed to a module");
				var newServerId=processList.length;
				processList.push(new Object);
				processList[newServerId].name=context.name;
				var process=processList[newServerId];
				process.clients=[client];
				client.localId=0;
				client.serverId=newServerId;
				processList[newServerId].module=require("./"+modPath+'/'+context.type+'.js');
				console.log("process with name "+process.name+ " running module "+context.type);
				client.send('cnsl::{"msg":"successfully initiated process '+context.type+'!"}');
				client.inProcess=true;
				if(typeof(processList[newServerId].module["init"]) === "function"){
					processList[newServerId].module["init"](json.cloneObject(client));
				}else{
					console.log("missing init funcion");
				}
			}
		catch(e){
  			console.log("[In module ("+context.type+")]: "+e+"\n\n");
  			console.log(e.stack);
  			client.send('cnsl::{"msg":"process '+context.type+' does not exists"}');
  			//client.send("serverMessages::You were kicked from the server");
  			//server.leaveProcess(client);
		}

		

	}



	this.joinProcess=function(context,client){
		//console.log(context.serverId);
		//console.log(server.processList.length);
		if(context.serverId<processList.length && processList.length>0&&client.serverId===undefined){
			client.serverId=context.serverId;
			client.localId=processList[context.serverId].clients.length;
			processList[context.serverId].clients.push(client);
			console.log("new user joined");
			client.send('cnsl::{"msg":"succefully joined process '+processList[context.serverId].name+'"}');
			client.inProcess=true;
			if(processList[context.serverId].module!==undefined &&typeof(processList[context.serverId].module[newUserFunc]) == "function"){
				processList[context.serverId].module[newUserFunc](json.cloneObject(client));
			}else{
				console.log("missing "+newUserFunc+" funcion");
			}

		}else{
			if(client.serverId!==undefined){
				console.log("user already subscribed to process "+processList[client.serverId].name);
			}else{
				console.log("failed to join bad index -> "+context.serverId);
				client.send('cnsl::{"msg":"no server with that id"}');
			}
		}
	}
	
	this.leaveProcess=function(client){
		//console.log(client.serverId+ " ==================================================");
		if(client.serverId!=undefined){
			//console.log(client.serverId+"efnweoifnewfnwoeifnwenfwneinfwinfwenf");
			for (var i=client.localId;i<processList[client.serverId].clients.length;i++){
				processList[client.serverId].clients[i].localId--;
			}
			processList[client.serverId].clients.splice(client.localId+1,1);
			//console.log(server.processList[client.serverId].clients.splice(client.localId+1,1));
			
			if(processList[client.serverId].clients.length===0){
				console.log("closing server "+server.processList[client.serverId].name);
				processList.splice(client.serverId,1);

				for(var i=client.serverId;i<processList.length;i++){
					for (var n=0;n<processList[i].clients.length;n++){
						processList[i].client[n].serverId--;
					}
				}
			}else{
				if(typeof(processList[client.serverId].module["onClose"]) === "function"){
					client.localId++;
					client.verfication=json.cloneObject(processList[client.serverId].clients[0]);
					processList[client.serverId].module["onClose"](client);
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


	this.listProcesses=function(client){
		var serverList=new Array;
		var name;
		for(var i=0;i<processList.length;i++){
			name=processList[i].name;
			serverList.push('{"name":"'+name+'","serverId":'+i+'}');

		}
		client.send('listing::{"list":'+serverList+'}');
	}

  /*
   * Event handlers for connections
   *
   * */

  //message processor==============================================0
	this.decode=function(stringData){
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
	this.msgRelay=function(message,client){
		client.api=interface;
		var dir;
		try{
			dir=this.decode(message.toString())
		}catch(err){
			console.log(" [calling decode]: "+err);
			dir=null;
		}
		if(dir===null)return null;
		//console.log(this.inProcess);

		if(client.inProcess!==true){
			this[dir.func](dir.arg,client);
		}else{
			if(client.staticFunction===undefined){
				processList[client.serverId].module[dir.func](dir.arg,json.cloneObject(client));
			}else{
				//console.log(dir.arg+"    god natt");
				processList[client.serverId].module[client.staticFunction](dir.arg ,json.cloneObject(client));
			}
		}
	}
	
	//test client=================================
	this.dummy= function(){
		return new function(){
			var test="";
			this.send=function(msg){test=msg;};
			this.inspect=function(){
				return test;
			}
			
			this.api=interface;
			this.attribute={};
		}
	}
	
	this.interface= function(){
		return interface;
	}
	
	
}
