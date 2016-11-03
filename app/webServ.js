var mod=module.exports;
var sender;

var packageList=new Array;

 mod.init=function(host){
	 sender=host;
	 global.setStaticFunction("onMessage",host);
	 global.setVIP_user(host);
	 
};

mod.newUser=function(user){
	
}
var counter=0;

mod.onMessage=function(data,client){
	//console.log(data.value+ "\n heloo govenor");
	//counter++;
	//console.log(counter);
	var userList=global.getClients(client);
	//1478179373
	
	var msg=global.objectToString(data);
	//console.log(msg);
	for(var i=0;i<userList.length;i++){	
		//console.log(msg);
		userList[i].send('cnsl::'+msg);
	}
}

mod.onClose=function(client){
	if(client.isVIP){
		console.log("host left turning of server "+client.serverId);
		var userList=global.getClients(client.verfication);
		for(var i=0;i<userList.length;i++){	
		//console.log(msg);
			global.kickUser(userList[i]);
		}
	}
	
}
