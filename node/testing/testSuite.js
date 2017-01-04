
var query = require('../app/models/QueryBuilder.js');
//var user_test="kaka";
//var test_hub="kitchen";
//var count=0;
module.exports = {
startTest:function(name,hub){
	//user_test=name;
	//test_hub=hub;
  //add references to functions defined below for various testing
//  st(); //this one creates dummy values for use with mongo without having to rely on the relays or the value generators
	setInterval(function(){st(name,hub)}, 500);

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


st = function(user_test,test_hub){
		var payload = createPayload(user_test,test_hub);
		query.checkUser(payload.temperature);
		query.checkUser(payload.humidity);
		query.checkUser(payload.smoke);
    console.log(Date.now());
};


createPayload = function(user_test,test_hub){
  var payload = {};

  payload.temperature = {
  	sensor_hub : test_hub,
  	user : user_test,
  	group : "random",
  	value : randomnmr(10,30),
  	sensorID : "temperature",
  	sensor_unit : "oC",
  	smart_mirror_ID : "wedontcare",
  	timestamp : Date.now()
  };
  payload.humidity = {
  	sensor_hub : test_hub,
  	user : user_test,
  	group : "random",
  	value : randomnmr(40,90),
  	sensorID : "humidity",
  	sensor_unit : "oC",
  	smart_mirror_ID : "wedontcare",
  	timestamp : Date.now()
  };
  payload.smoke = {
  	sensor_hub : test_hub,
  	user : user_test,
  	group : "random",
  	value : randomnmr(0,35),
  	sensorID : "smoke",
  	sensor_unit : "oC",
  	smart_mirror_ID : "wedontcare",
  	timestamp : Date.now()
  };
  return payload;
}
