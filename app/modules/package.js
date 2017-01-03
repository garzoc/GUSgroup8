var mod=module.exports;
var json=require('./jsonObj.js');
var query = require('../models/QueryBuilder.js');
var mqtt=require("mqtt");
var mqttClient  = mqtt.connect('mqtt://prata.technocreatives.com')
var Id;
var timeLoop;
var packageList=new Array;
var senders=new Object();

mod.init=function(host){
	 var client=host;
	host.api.setStaticFunction("onMessage",host);
	host.api.setVIP_user(host);
	Id=randomId();
	timeLoop=setInterval(function(){
		var currentTime=Math.floor(Date.now()/1000);
		for(k in senders){
			//console.log(senders[k]+"   ===============================================================================================");
			if(senders[k]!==undefined&&currentTime-(3)>senders[k].timestamp){
				//console.log((currentTime-senders[k].timestamp)+" ========="+currentTime+"===================="+senders[k].timestamp+"==========================!!!!!!!!!!!===========");
				var content=new Object;
				content[senders[k].sensor_hub]="offline";
				mqttClient.publish('dit029/SmartMirror/'+senders[k].smart_mirror_ID+'/deviceStatus',JSON.stringify(to_smartMirror(senders[k].timestamp,content)));
				console.log(JSON.stringify(to_smartMirror(senders[k].timestamp,content)));
				senders[k]=undefined;
				//console.log("dropped connection ====================================");
			}
		}
		
		
		
	},1000);
	//host.api.kickUser(host);

};


function randomId(){
	//var s = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
	var container="";
	for(var i=0;i<32;i++){
		container=container+Math.floor((Math.random())*0x10000).toString(16).substring(1);
	}
	
	return container;
}




mod.newUser=function(user){

	console.log("thena");
	user.api.setStaticFunction("onMessage",user);

}
var counter=0;


function msg(data,client){
	var userList=client.api.getClients(client);
	var msg=json.objectToString(data);

	for(var i=0;i<userList.length;i++){
		userList[i].send(msg);
	}
	

}


function to_smartMirror(time,Content){

	return {
		//messageFrom:pack.user,
		messageFrom:Id,
		timestamp:time,
		//sharedContent:pack.sensor_hub,
		sharedContent:"device status",
		content:[Content]
	}

}



mod.onMessage=function(data,client){

to_smartMirror
	if(data.constructor===Array && data.length>1) {
		//console.log("data is array ??????????????????????????????????????????????????????+");
		var sPacket=new Object;
		for(var i=0;i<data.length;i++) {//rewtire package to smart mirror
			data[i]=JSON.parse(data[i])
			
			if(data[i].smart_mirror_ID!==undefined){
				var content=new Object;
				content[data[i].sensor_hub]="online";
				if(senders[data[i].user+"/"+data[i].sensor_hub]===undefined) mqttClient.publish('dit029/SmartMirror/'+data[i].smart_mirror_ID+'/deviceStatus',JSON.stringify(to_smartMirror(data[i].timestamp,content)));
				//console.log(senders);
				if(senders[data[i].user+"/"+data[i].sensor_hub]===undefined) console.log(JSON.stringify(to_smartMirror(data[i].timestamp,content)));
				senders[data[i].user+"/"+data[i].sensor_hub]=new Object;
				senders[data[i].user+"/"+data[i].sensor_hub].timestamp=data[i].timestamp;
				senders[data[i].user+"/"+data[i].sensor_hub].smart_mirror_ID=data[i].smart_mirror_ID;
				senders[data[i].user+"/"+data[i].sensor_hub].sensor_hub=data[i].sensor_hub;
	
			}
		}
		
		
		
		//console.log(JSON.stringify(sPacket));
		


		for(var i=0;i<data.length;i++){
			//console.log(data[i]);
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

mod.onShutdown=function(client){
	if(timeLoop!==undefined)clearInterval(timeLoop);

}

//var Package = require('./app/models/Package');
// var pack = new Package();

// pack.save();
