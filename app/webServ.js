 var mod=module.exports;
var sender;
var userList=new Array;
 mod.init=function(host){
	 sender=host;
	 host.permFunc="onMessage";
};

mod.newUser=function(user){
	userList.push(user);
	//global.relay('{"name":"mooo","type":"webServ"}');
}

mod.onMessage=function(data,client){
	console.log(data+ "\n heloo govenor");
	
	for(var i=0;i<userList.length;i++){
		userList[i].send('cnsl::{"msg":"'+data.value+'"}');
		
	}
}
