-module(config_accesser).
-author("Isar Arason").
-export([get_field/1, get_sensor_unit/1, get_sensor_pin/1, test/0]).

% Open config file and find the value associated with the key
get_field(Field) ->
	{ok, File} =  file:consult("user.conf"),
	get_field(Field, File).

get_field(Field, [{A, B}|_]) when A == Field-> 
	B;

get_field(Field, [_|Ls]) -> 
	get_field(Field, Ls).
	
% Get the sensor list from the config file and retrieve its unit
get_sensor_unit(SensorName) ->
	get_sensor_unit(SensorName, get_field(sensors)).

get_sensor_unit(SensorName, [{N, U, _}|_]) when SensorName == N ->
	U;
get_sensor_unit(SensorName, [_|Ls]) ->
	get_sensor_unit(SensorName, Ls).
	
% Get the sensor list from the config file and retrieve its pin number
get_sensor_pin(SensorName) ->
	get_sensor_pin(SensorName, get_field(sensors)).

get_sensor_pin(SensorName, [{N, _, P}|_]) when SensorName == N ->
	P;
get_sensor_pin(SensorName, [_|Ls]) ->
	get_sensor_pin(SensorName, Ls).
	
test() -> 
	io:format("User: ~p~n", [get_field(user)]),
	io:format("Group: ~p~n", [get_field(group)]),
	io:format("Sensor unit: ~p~n", [get_sensor_unit(testSensor3)]),
	io:format("Sensor pin: ~p~n", [get_sensor_pin(testSensor3)]).