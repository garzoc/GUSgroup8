var mod=module.exports;
var sender;
var pack = require('../models/Package.js');
var json=require('./jsonObj.js');


var packageList=new Array;

mod.init=function(host){
	 sender=host;
	 //console.log("wjenfwejkfwefnwekfwekn");
	 host.api.setStaticFunction("onMessage",host);
	 host.api.setVIP_user(host);
	 console.log("waxxxsaa");
	 //console.log(host.api.getStat().localId);
	 //console.log(host.api.getStat().staticFunction);
	 //console.log(host.api.getStat().isVIP);
	 //host.api.add_custom_attribute("test",function(){return processList},host);
	// host.interface.getClients(host);
		/*var package = new pack();
		package.user = "Test User";
		package.group = "Group8";
		package.value = 88;
		package.sensorID = "Sensor 0";
		package.timestamp = Date.now();
		package.unit = "%";
		package.save();*/
};


	
	


mod.newUser=function(user){

	user.api.setStaticFunction("onMessage",user);
}


mod.onMessage=function(data,client){
	var array=client.api.getClients(client);
	for(var i =0;i<array.length;i++){
		array[i].send(json.objectToString(data));
	}

}

mod.onClose=function(client){
	if(client.api.getStat().isVIP){
		console.log("host left, turning of process "+client.api.getStat().serverId);
		var userList=client.api.getClients(client);
		for(var i=0;i<userList.length;i++){

			client.api.kickUser(userList[i]);
		}
	}

}

//var Package = require('./app/models/Package');
// var pack = new Package();

// pack.save();
