var mod=module.exports;
var sender;
var json=require('./jsonObj.js');
var query = require('../models/QueryBuilder.js');


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
	//console.log(user.isVIP);
	//console.log(user.api.getClients(user)[0].attribute.test());
	//console.log(user.api.getClients(user)[0].isVIP);
	console.log("thena");
	user.api.setStaticFunction("onMessage",user);
}
var counter=0;


function msg(data,client){

	//JSON.parse(data);

	var userList=client.api.getClients(client);
	var msg=json.objectToString(data);
	//console.log(msg+   "wefwefwefwe");
	//client.send(msg);
	for(var i=0;i<userList.length;i++){
		//console.log(msg);
		userList[i].send(msg);
	}

}



function to_smartMirror(pack){

	return {
		messageFrom:pack.user,
		timestamp:pack.timestamp,
		sharedContent:pack.sensor_hub,
		content:[new Object]
	}

}

mod.onMessage=function(data,client){

	//counter++;
	//console.log(counter);
	//console.log(data);
	//1478179373
	//console.log(data+"  god morgin");
	if(data.constructor===Array && data.length>1) {
		console.log("data is array ??????????????????????????????????????????????????????+");
		var sPacket=new Object;
		for(var i=0;i<data.length;i++) {
			data[i]=JSON.parse(data[i])
			if(data[i].smart_mirror_ID!==undefined){
				if(sPacket[data[i].sensor_hub]===undefined)sPacket[data[i].sensor_hub]=to_smartMirror(data[i]);//defined a new smart mirror package
				if(sPacket[data[i].sensor_hub].messageFrom===data[i].user){//if the groups are owned by the same user
					sPacket[data[i].sensor_hub].content[0][data[i].sensorID]=data[i].value;
				}else{
					var n=0;
					while(true){
						if(sPacket[data[i].sensor_hub+""+n]===undefined) sPacket[data[i].sensor_hub+""+n]=to_smartMirror(data[i]);
						if(sPacket[data[i].sensor_hub+""+n].messageFrom===data[i].user){
							sPacket[data[i].sensor_hub+""+n].content[0][data[i].sensorID]=data[i].value;
							break;
						}
					}
				}
			}
		}
		
		console.log(JSON.stringify(sPacket));
		


		for(var i=0;i<data.length;i++){
			msg(data[i],client);
			query.checkUser(data[i]);
		}
	}else{
		msg(data,client);
		query.checkUser(data);
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
