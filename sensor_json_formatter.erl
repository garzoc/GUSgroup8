% Formats a JSON package to be sent to the relay server

-module(sensor_json_formatter).
-author("Isar Arason").
-export([sensor_to_json/2]).

sensor_to_json(Value, SensorName) ->
	M = [
			{user, config_accesser:get_field(user)},
			{group, config_accesser:get_field(group)},
			{value, Value},
			{sensorID, SensorName},
			{timestamp, erlang:system_time()},
			{unit, config_accesser:get_sensor_unit(SensorName)}
		],
	json:decode(M).