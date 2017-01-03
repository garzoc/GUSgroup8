var exports = module.exports;

exports.startTest = function(){
  //add references to functions defined below for various testing
  setInterval(function(){st(client)}, 500);
};



///-----------------------CUSTOM TESTING FUNCTIONS ----------------------------------////
///----------------------------------------------------------------------------------////
function randomnmr(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var sensor_arr = ["temperature", "humidity", "smoke"];


st = function(clnt){
		var msgg = '{"user":"admin"}{"sensor_hub":"Garage"}{"sensorID":'+ sensor_arr[randomnmr(0,2)]+'}{"value":' + randomnmr(0,45)+'}';
		console.log(msgg);
		server.msgRelay(msgg,client);
};



var a = {
	sensor_package : "Bathroom",
	user : "admin",
	group : "random",
	value : "145",
	sensorID : "temperature",
	sensor_unit : "oC",
	smart_mirror_ID : "wedontcare",
	timestamp : Date.now()
};
