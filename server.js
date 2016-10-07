var WebSocketServer = require('ws').Server;
var socketPort=8000;
var socket = new WebSocketServer({ port:socketPort });
console.log("server running on port "+socketPort);


var mqtt = require('mqtt');
var mqttClient  = mqtt.connect('mqtt://broker.hivemq.com');

mqttClient.on('connect', function () {
  mqttClient.subscribe('group8');
  //mqttClient.publish('group8', 'Hello mqtt');
});
 
mqttClient.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString());
  mqttClient.end();
});



//web.proccessList=[];
//web.clientsInProcess=[];


socket.on('connection', function conn(client) {
	console.log("Client connect");
  
	client.on('message', function incoming(message) {
	  
	this.send(message);
	});
  
  client.on('close',function fun(client){
		console.log("client connection lost");
	  
	});
});

socket.on('close', function conn() {
	console.log("shuting down servers");
	
	socket.clients.foreach(function every(client){
		client.send("closing server");
	});
 
});
