
var json=require("./jsonObj");

module.exports = function(){
	//configuration=============================================

	var modPath="";
	var newUserFunc="newUser";
	processList=[];
	
	
	
	var Interface=function(token){
		
		var stat= new function(token){
			var Token=token;
			this.inProcess=false;
			this.isHost=false;
			this.isVIP=false;
			this.serverId;
			this.localId;
			this.staticFunction;
			this.getToken=function(){return Token};
		}
		
		function getClientInList(client){
			//console.log(processList[client.api.getStat().serverId].clients+"  eiufuiwefneufuewfnenfuwefwenfuwenfweuf");
			return processList[client.api.getStat().serverId].clients[client.api.getStat().localId];
		}
		
		function verifiedClient(client){
			if(stat.getToken()===client.api.getStat().getToken()&&json.matchObject(client.api.getStat(),getClientInList(client).api.getStat())){
				return true;
			}
			return false;
		}
		
		function updateClient(client){
			json.overwriteObject(client.api.getStat().getToken(),getClientInList(client).api.getStat().getToken());
		}
			
		
		this.getStat=function(){	
			return stat;
		};
	
		
		this.getClients=function(client){
			if(verifiedClient(client)){
				return processList[client.api.getStat().serverId].clients;
			}else{
				console.log("failed modified client client");
				return processList[client.api.getStat().serverId].clients;
			}
			updateClient(client);
		};
	

		this.setVIP_user=function(client){
			if(verifiedClient(client)){
				processList[client.api.getStat().serverId].clients[client.api.getStat().localId].api.getStat().isVIP=true;
			}else{
				console.log("failed modified client client");
			}
			updateClient(client);
		};

		this.kickUser=function(client){
			if(verifiedClient(client)){
				server.leaveProcess(client);
			}else{
				console.log("failed modified client client");
			}
			updateClient(client);
		};

		this.setStaticFunction=function(func,client){
			//console.log("niti");
			if(verifiedClient(client)){
				//console.log("success");
				processList[client.api.getStat().serverId].clients[client.api.getStat().localId].api.getStat().staticFunction=func;
			}else{
				processList[client.api.getStat().serverId].clients[client.api.getStat().localId].api.getStat().staticFunction=func;
				console.log("failed modified client client");
			}
			updateClient(client);
		};
		
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
    
    
    

	
  //server.clientsInProcess=[];



  //module handlers=============================================
  //init context->{"name","type"}
	this.initProcess= function(context,client){
  	//console.log(context.name+"dfkjwenfjwenfjwenfkjwenfenfjwenfnwejnfwenfjkwfefnwekjn");
	
	
  	//console.log(server.processList.length+"  hello");

		try{
			if(client.api.getStat().serverId!=undefined)throw("user already subscribed to a module");
				var newServerId=processList.length;
				processList.push(new Object);
				processList[newServerId].name=context.name;
				var process=processList[newServerId];
				process.clients=[client];
				client.api.getStat().localId=0;
				
				client.api.getStat().serverId=newServerId;
				processList[newServerId].module=require("./"+modPath+'/'+context.type+'.js');
				console.log("process with name "+process.name+ " running module "+context.type);
				client.send('cnsl::{"msg":"successfully initiated process '+context.type+'!"}');
				client.api.getStat().inProcess=true;
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
		if(context.serverId<processList.length && processList.length>0&&client.api.getStat().serverId===undefined){
			client.api.getStat().serverId=context.serverId;
			client.api.getStat().localId=processList[context.serverId].clients.length;
			client.api.getStat().inProcess=true;
			processList[context.serverId].clients.push(client);
			console.log("new user joined");
			client.send('cnsl::{"msg":"succefully joined process '+processList[context.serverId].name+'"}');
			
			if(processList[context.serverId].module!==undefined &&typeof(processList[context.serverId].module[newUserFunc]) == "function"){
				processList[context.serverId].module[newUserFunc](json.cloneObject(client));
			}else{
				console.log("missing "+newUserFunc+" funcion");
			}

		}else{
			if(client.serverId!==undefined){
				console.log("user already subscribed to process "+processList[client.api.getStat().serverId].name);
			}else{
				console.log("failed to join bad index -> "+context.serverId);
				client.send('cnsl::{"msg":"no server with that id"}');
			}
		}
	}
	
	this.leaveProcess=function(client){
		console.log(client.api.getStat().serverId+ " ==================================================");
		if(client.api.getStat().serverId!=undefined){
			//console.log(client.serverId+"efnweoifnewfnwoeifnwenfwneinfwinfwenf");
			for (var i=client.api.getStat().localId;i<processList[client.api.getStat().serverId].clients.length;i++){
				processList[client.api.getStat().serverId].clients[i].api.getStat().localId--;
			}
			processList[client.api.getStat().serverId].clients.splice(client.api.getStat().localId+1,1);
			//console.log(server.processList[client.serverId].clients.splice(client.localId+1,1));
			
			if(processList[client.api.getStat().serverId].clients.length===0){
				console.log("closing server "+processList[client.api.getStat().serverId].name);
				processList.splice(client.api.getStat().serverId,1);
				console.log("serveris is   "+client.api.getStat().serverId);
				console.log("server length  is   "+processList.length);
				for(var i=client.api.getStat().serverId;i<processList.length;i++){
					for (var n=0;n<processList[i].clients.length;n++){
						processList[i].client[n].api.getStat().serverId--;
					}
				}
			}else{
				if(typeof(processList[client.api.getStat().serverId].module["onClose"]) === "function"){
					client.api.getStat().localId++;
					//client.verfication=json.cloneObject(processList[client.serverId].clients[0]);
					processList[client.api.getStat().serverId].module["onClose"](client);
				}else{
					console.log("missing onClose funcion");
				}
			}
			client.api.getStat().inProcess=undefined
			client.api.getStat().staticFunction=undefined;
			client.api.getStat().localId=undefined;
			client.api.getStat().serverId=undefined;
			client.api.getStat().verfication=undefined;
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
		//console.log(stringData);
		//var packetStruct=stringData.split("::");
		var packetStruct=stringData;
		var data={};
		//console.log(packetStruct[0]);
		//console.log(buffer.constructor===Array);
		//console.log(buffer);
		if(packetStruct.constructor===Array && packetStruct.length>1) {
			data.func=packetStruct[0];
			data.arg=JSON.parse(packetStruct[1]);
		}else{
			//var packetData=packetStruct[0];//string made up of several json obejcts
			var packetData=packetStruct;
			buffer=packetData.split("}{");
			if(buffer.constructor===Array && buffer.length>1){
				//console.log(packetData+"    god natt=====================================0");
				data=[];
				data.push(buffer[0]+"}");
				for(var i=1;i<buffer.length-1;i++){
					data.push("{"+buffer[i]+"}");
				}
				data.push("{"+buffer[buffer.length-1]);
				//console.log(data.arg[0]+"    god natt");

				if(packetData.substr(0,1)!=="{"){
					data.splice(0,1);
				}
				if(packetData.substr(packetData.length-1,packetData.length)!=="}"){
					data.splice(data.length-1,1);
				}
				
			}else{
				
				data=JSON.parse(packetData);
				console.log("mfwiemfoiewoeiw    "+packetData.use);
			}
		}

		return data;
	}


  //relay messages to modules
	this.msgRelay=function(message,client){
		//client.api=interface;
		var dir;
		try{
			dir=this.decode(message.toString().trim());
			//console.log(dir.arg);
		}catch(err){
			console.log(" [calling decode]: "+err);
			console.log(err.stack);
			
			dir=null;
		}
		if(dir===null)return null;
		//console.log(this.inProcess);

		if(client.api.getStat().inProcess!==true){
			//console.log("tjenare    "+dir.use);
			if(dir.constructor===Array){
				try{dir=this.decode(dir[0]);this[dir.use](dir.context,client);}catch(err){console.log(err)};
			}else{
				try{this[dir.use](dir.context,client);}catch(err){console.log(err)};
			}
		}else{
			if(client.api.getStat().staticFunction===undefined){
				processList[clien.api.getStat().serverId].module[dir.use](dir.context,json.cloneObject(client));
			}else{
				//console.log(dir.arg+"    god natt");
				processList[client.api.getStat().serverId].module[client.api.getStat().staticFunction](dir,json.cloneObject(client));
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
		return new Interface(0);
	}
	
	
}
