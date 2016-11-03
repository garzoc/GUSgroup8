% Formats a JSON package to be sent to the relay server

-module(sensor_json_formatter).
-author("Isar Arason").
-export([sensor_to_json/2, sensor_to_broker_json/2, test/0]).

sensor_to_json(Value, SensorName) ->
	M = [
			{package, config_accesser:get_field(package)},
			{user, config_accesser:get_field(user)},
			{group, config_accesser:get_field(group)},
			{value, Value},
			{sensorID, SensorName},
			{timestamp, erlang:system_time(seconds)},
			{unit, config_accesser:get_sensor_unit(SensorName)}
		],
	json:decode(M).

% Returns a json value formatter with the /Group/User/Package
% as a tuple of atoms
sensor_to_broker_json(Value, SensorName) ->
    M = 
		[
			{value, Value}, 
			{sensorID, SensorName}, 
			{timestamp, erlang:system_time(seconds)}
		],
	User = config_accesser:get_field(user),
	Group = config_accesser:get_field(group),
	Package = config_accesser:get_field(package),
    {Package, User, Group, json:decode(M)}.
	
test() ->
	sensor_to_json(1, testSensor1).