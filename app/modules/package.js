var mod=module.exports;
var json=require('./jsonObj.js');
var query = require('../models/QueryBuilder.js');
var mqtt=require("mqtt");
var mqttClient  = mqtt.connect('mqtt://prata.technocreatives.com')
var Id;

var packageList=new Array;
//socket.send('{"use":"joinProcess","context":{"serverId" : 0}}');

mod.init=function(host){
	 var client=host;
	 //console.log("wjenfwejkfwefnwekfwekn");
	host.api.setStaticFunction("onMessage",host);
	host.api.setVIP_user(host);

	/*mqttClient.on('connect', function () {
  		this.subscribe('dit029/SmartMirror/SmartMirrorID/deviceStatus');
	});*/
	Id=randomId();

};


function randomId(){
	var s = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
	var container="";
	for(var i=0;i<32;i++){
		container=container+Math.floor((Math.random())*0x10000).toString(16).substring(1);
	}
	
	return container;
}




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



function to_smartMirror(time,cont){

	return {
		//messageFrom:pack.user,
		messageFrom:Id,
		timestamp:time,
		//sharedContent:pack.sensor_hub,
		sharedContent:"device status",
		content:[cont]
	}

}

var senders=new Object();

mod.onMessage=function(data,client){

to_smartMirror
	if(data.constructor===Array && data.length>1) {
		//console.log("data is array ??????????????????????????????????????????????????????+");
		var sPacket=new Object;
		for(var i=0;i<data.length;i++) {//rewtire package to smart mirror
			data[i]=JSON.parse(data[i])
			
			if(data[i].smart_mirror_ID!==undefined){
				senders[data[i].user+"/"+data[i].senor_hub].timestamp=data[i].timestamp;
				senders[data[i].user+"/"+data[i].senor_hub].smart_mirror_ID=data[i].smart_mirror_ID;
			/*	if(sPacket[data[i].sensor_hub]===undefined)sPacket[data[i].sensor_hub]=to_smartMirror(data[i]);//defined a new smart mirror package
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
				}*/
			}
		}
		
		for(k in senders){
			console.log(senders[k]+"   ===============================================================================================");
			if(data[0].timestamp-(30)>senders[k].timestamp){
				var content=new Object;
				content[k]="off";
				mqttClient.publish('dit029/SmartMirror/'+senders[k].smart_mirror_ID+'/deviceStatus',JSON.stringify(to_smartMirror(senders[k].timestamp,content)));
				console.log("dropped connection ====================================");
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

//var Package = require('./app/models/Package');
// var pack = new Package();

// pack.save();
