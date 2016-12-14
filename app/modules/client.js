
/*
Simple Node.js client 
*/
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://broker.hivemq.com');

//Connects to the broker(on a local host) specified by the given url and options and returns a Client.
//replace with test server ('mqtt://test.mosquitto.org')
//var client = mqtt.connect({  host: 'localhost', port: 0000  });

cclient.subscribe('group8')
client.publish('group8', 'bin hier')
client.on('message', function (topic, message) {
  console.log(message)
})
client.end()
