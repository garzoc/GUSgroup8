var mod=module.exports;
var sender;
var pack = require('../models/Package.js');
var json=require('./jsonObj.js');


var packageList=new Array;

mod.init=function(host){
	 sender=host;
	 host.api.setStaticFunction("onMessage",host);
	 host.api.setVIP_user(host);
	 console.log(host.isVIP);
	 //host.api.add_custom_attribute("test",function(){return processList},host);
	// host.interface.getClients(host);
		var package = new pack(); 
		package.user = "Test User";
		package.group = "Group8";
		package.value = 88;
		package.sensorID = "Sensor 0";
		package.unit = "%";
		package.save();
};

mod.newUser=function(user){
	//console.log(user.isVIP);
	//console.log(user.api.getClients(user)[0].attribute.test());
	//console.log(user.api.getClients(user)[0].isVIP);
	console.log("thena");
	user.api.setStaticFunction("onMessage",user);
}
var counter=0;

function msg(data,client){
	var userList=client.api.getClients(client);
	var msg=json.objectToString(data);
	console.log(msg);
	client.send(msg);
	for(var i=0;i<userList.length;i++){	
		//console.log(msg);
		userList[i].send(msg);
	}
	
}


mod.onMessage=function(data,client){

	//counter++;
	//console.log(counter);
	
	//1478179373
	//console.log(data+"  god morgin");
	if(data.constructor===Array && data.length>1) {
		console.log("data is array ??????????????????????????????????????????????????????+");
			for(var i in data) msg(i,client);
	}else{
		msg(data,client);
	}
	
}

mod.onClose=function(client){
	if(client.isVIP){
		console.log("host left, turning of process "+client.serverId);
		var userList=global.getClients(client.verfication);
		for(var i=0;i<userList.length;i++){	
		
			global.kickUser(userList[i]);
		}
	}
	
}

//var Package = require('./app/models/Package');
// var pack = new Package();

// pack.save();
