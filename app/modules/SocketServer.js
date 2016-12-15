
var json=require("./jsonObj");

module.exports = function(){
	//configuration=============================================

	var modPath="";//path of where moduiles are stored
	var newUserFunc="newUser";//name of the function that will be called every time a user joins a modules
	processList=[];//list of modules








  //server.clientsInProcess=[];



  //module handlers=============================================
  //init context->{"name","type"}
	this.initProcess= function(context,client){// init new module or a new instance of existing module


  	//console.log(server.processList.length+"  hello");

		try{
			if(client.api.getStat().serverId!=undefined)throw("user already subscribed to a module");//user can only be part of one module at the time
				var newServerId=processList.length;//crete new id based on the modules position in the list
				processList.push(new Object);
				processList[newServerId].name=context.name;//assign a name to the newly created obect which was specified in the context
				var process=processList[newServerId];
				process.clients=[client];//create a list of clients for the modules
				client.api.getStat().localId=0;//assing a local id to the client

				client.api.getStat().serverId=newServerId;//assing the server id
				processList[newServerId].module=require("./"+modPath+'/'+context.type+'.js');//load the module
				console.log("process with name "+process.name+ " running module "+context.type);
				client.api.getStat().inProcess=true;//the client is part of the module
				if(typeof(processList[newServerId].module["init"]) === "function"){//call the init funcion
					processList[newServerId].module["init"](json.cloneObject(client));
				}else{
					console.log("missing init funcion");
				}
			}
		catch(e){
  			console.log("[In module ("+context.type+")]: "+e+"\n\n");
  			console.log(e.stack);
  			//client.send('cnsl::{"msg":"process '+context.type+' does not exists"}');
  			//client.send("serverMessages::You were kicked from the server");
  			//server.leaveProcess(client);
		}



	}



	this.joinProcess=function(context,client){

		//look at initProcess for reference
		if(context.serverId<processList.length && processList.length>0&&client.api.getStat().serverId===undefined){
			client.api.getStat().serverId=context.serverId;
			client.api.getStat().localId=processList[context.serverId].clients.length;
			client.api.getStat().inProcess=true;
			processList[context.serverId].clients.push(client);
			console.log("new user joined");
			
			//call the new user function
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
				//client.send('cnsl::{"msg":"no server with that id"}');
			}
		}
	}

	this.leaveProcess=function(client){
		console.log("client left");
		console.log(client.api.getStat().serverId+ " ==================================================");
		var stats=client.api.getStat();
		
		//remove the user from the list of clients
		if(stats.serverId!==undefined && stats.serverId<processList.length){
			processList[stats.serverId].clients.splice(stats.localId,1);//removed localid+1 and just used local Id
			for (var i=stats.localId;i<processList[stats.serverId].clients.length;i++){
				processList[stats.serverId].clients[i].api.getStat().localId--;//correct the localId of the clients client list
			}

			if(processList[stats.serverId].clients.length===0){//if server is out of client then delete remove the module
				if(typeof(processList[stats.serverId].module["onShutdown"]) === "function"){//call the on shutdown functoins funcion [NOT TESTED!!!!]
					processList[stats.serverId].module["onShutdown"](json.cloneObject(client));
				}else{
					console.log("missing onShutdown funcion");
				}
				console.log("closing process "+processList[stats.serverId].name);
				processList.splice(stats.serverId,1);
				//console.log("serveris is   "+stats.serverId);
				//console.log("server length  is   "+processList.length);
				try{
					for(var i=stats.serverId;i<processList.length;i++){//correct the client id if clients in client lists
						for (var n=0;n<processList[i].clients.length;n++){
							processList[i].client[n].api.getStat().serverId--;
						}
					}
				}catch(error){
					console.log(error);
				}
			}else{
				if(typeof(processList[stats.serverId].module["onClose"]) === "function"){
					stats.localId++;
					//client.verfication=json.cloneObject(processList[client.serverId].clients[0]);
					processList[stats.serverId].module["onClose"](client);
				}else{
					console.log("missing onClose funcion");
				}
			}
			
			/*stats.inProcess=undefined
			stats.staticFunction=undefined;
			stats.localId=undefined;
			stats.serverId=undefined;
			stats.verfication=undefined;*/
			//client.api=new Interface(0);

		}
		client.api=new Interface(0);
		/*for(k in client.api.getStat()){
			client.api.getStat()[k]=undefined;
		}*/
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
	
		
			var packetData=stringData;
			buffer=packetData.split("}{");//split the sting in to list(string is made up of several json objects)
			var data={};
			if(buffer.constructor===Array && buffer.length>1){
				//console.log(packetData+"    god natt=====================================0");
				var data=[];
				//start fixing the malformed json objects
				data.push(buffer[0]+"}");//fix first objects
				for(var i=1;i<buffer.length-1;i++){
					data.push("{"+buffer[i]+"}");//fix every object except for the last one
				}
				data.push("{"+buffer[buffer.length-1]);//fix the last objects

				if(packetData.substr(0,1)!=="{"){//if the first string in the list is not a prober json object delete it
					data.splice(0,1);
				}
				if(packetData.substr(packetData.length-1,packetData.length)!=="}"){//if the last string in the list is not a json object delete it
					data.splice(data.length-1,1);
				}

			}else{

				data=JSON.parse(packetData);//if string is just made up of one json object parse it and return
				//console.log("mfwiemfoiewoeiw    "+packetData.use);
			}
		

		return data;
	}


  //relay messages to modules
	this.msgRelay=function(message,client){

		var dir;
		try{
			dir=this.decode(message.toString().trim());//process the message
			//console.log(dir.arg);
		}catch(err){
			console.log(" [calling decode]: "+err);
			console.log(err.stack);
			dir=null;
		}
		if(dir===null)return null;
		if(client.api.getStat().inProcess!==true){//if client hasn't joinded a module 
			if(dir.constructor===Array){
				//if messageis made up of several obecjs
				try{dir=this.decode(dir[0]);this[dir.use](dir.context,client);}catch(err){console.log(err)};
			}else{
				//if msg was just on json objects
				try{this[dir.use](dir.context,client);}catch(err){console.log(err)};
			}
		}else{
			//if client has joined a modules but starticFunction is not defined
			if(client.api.getStat().staticFunction===undefined){
				processList[clien.api.getStat().serverId].module[dir.use](dir.context,json.cloneObject(client));
			}else{
				//if static function is defined
				try{processList[client.api.getStat().serverId].module[client.api.getStat().staticFunction](dir,json.cloneObject(client));}catch(e){}
			}
		}
	}

	//client=================================
	
	var leaveCtrl=this.leaveProcess;
		
	var Interface=function(token){//interface class
		
		var getToken=function(){};
		
		var stat= new function(token){//defined interfacing varibales
			var Token=token;//a unique identifier
			this.inProcess=false;//user is inside module
			this.isHost=false;//user is host
			this.isVIP=false;//a varibale that can be alters via the interface
			this.serverId;//serverID the id of the running modules the user is subscribed to
			this.localId;//gives a user a localId when they join or initiate a module
			this.staticFunction;//if defined all messages from this user will will be passed to a specific function regardless of what the package contains
			getToken=function(){return Token};//return private token variable
			this.matchToken=function(Toke){return Toke===Token?true:false;};
		}

		function getClientInList(client){//get all client in that is subscried to a module
			//console.log(processList[client.api.getStat().serverId].clients+"  eiufuiwefneufuewfnenfuwefwenfuwenfweuf");
			return processList[client.api.getStat().serverId].clients[client.api.getStat().localId];
		}

		function verifiedClient(client){//test if client hasn't been altered 
			if(client.api.getStat().matchToken(getToken())&&json.matchObject(client.api.getStat(),getClientInList(client).api.getStat())){
				return true;
			}
			return false;
		}

		function updateClient(client){//update the origin client in the module list
			json.overwriteObject(client.api.getStat(),getClientInList(client).api.getStat());
		}


		this.getStat=function(){
			return stat;
		};


		this.getClients=function(client){// get all clients of a module
			if(verifiedClient(client)){
				var oldArray=processList[client.api.getStat().serverId].clients;
				var newArray=new Array;
				for(var i=0;i<oldArray.length;i++){
					newArray[i]=json.cloneObject(oldArray[i]);
				}
				return newArray;
			}else{
				console.log("failed modified client client");
				//return processList[client.api.getStat().serverId].clients;
			}
			updateClient(client);
		};


		this.setVIP_user=function(client){//alter the vip variable in stat class
			if(verifiedClient(client)){
				var originalClient=processList[client.api.getStat().serverId].clients[client.api.getStat().localId];
				originalClient.api.getStat().isVIP=!originalClient.api.getStat().isVIP;
			}else{
				console.log("failed modified client client");
			}
			updateClient(client);
		};

		this.kickUser=function(client){//remove client from module controller
			if(verifiedClient(client)){
				leaveCtrl(getClientInList(client));
			}else{
				console.log("failed modified client client");
			}
			client===undefined;
		};

		this.setStaticFunction=function(func,client){//assign the static function
			//console.log("niti");
			if(verifiedClient(client)){
				//console.log("success");
				processList[client.api.getStat().serverId].clients[client.api.getStat().localId].api.getStat().staticFunction=func;
			}else{
				//processList[client.api.getStat().serverId].clients[client.api.getStat().localId].api.getStat().staticFunction=func;
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
	
	////=================================================
	this.interface= function(){//retunr a new instance of interface
		return new Interface(0);
	}
	
	this.dummy= function(){//create a simmple dummy function
		return new function(){
			var test="";
			this.send=function(msg){test=msg;};
			this.inspect=function(){
				return test;
			}
			
			this.api=new Interface(0);
			this.attribute={};
		}
	}
	
	
}
