
var query = require('../app/models/QueryBuilder.js');

module.exports = {
startTest:function(){
  //add references to functions defined below for various testing
//  st(); //this one creates dummy values for use with mongo without having to rely on the relays or the value generators
setInterval(function(){st()}, 500);

}

};




///-----------------------CUSTOM TESTING FUNCTIONS ----------------------------------////
///----------------------------------------------------------------------------------////
function randomnmr(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var sensor_arr = ["temperature", "humidity", "smoke"];


st = function(){
		var payload = createPayload();
		query.checkUser(payload.temperature);
    query.checkUser(payload.humidity);
    query.checkUser(payload.smoke);
    console.log(Date.now());
};


createPayload = function(){
  var payload = {};

  payload.temperature = {
  	sensor_hub : "Garage",
  	user : "admin",
  	group : "random",
  	value : randomnmr(10,30),
  	sensorID : "temperature",
  	sensor_unit : "oC",
  	smart_mirror_ID : "wedontcare",
  	timestamp : Date.now()
  };
  payload.humidity = {
  	sensor_hub : "Garage",
  	user : "admin",
  	group : "random",
  	value : randomnmr(40,90),
  	sensorID : "humidity",
  	sensor_unit : "oC",
  	smart_mirror_ID : "wedontcare",
  	timestamp : Date.now()
  };
  payload.smoke = {
  	sensor_hub : "Garage",
  	user : "admin",
  	group : "random",
  	value : randomnmr(0,35),
  	sensorID : "smoke",
  	sensor_unit : "oC",
  	smart_mirror_ID : "wedontcare",
  	timestamp : Date.now()
  };
  return payload;
}
