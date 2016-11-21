% Formats a JSON package to be sent to the relay server

-module(sensor_json_formatter).
-author("Isar Arason").
-export([sensor_to_json/2]).

% Returns a json message to be sent to the relay server.
sensor_to_json(Value, SensorName) ->
	M = [
			{sensor_package, config_accesser:get_field(package)},
			{user, config_accesser:get_field(user)},
			{group, config_accesser:get_field(group)},
			{value, Value},
			{sensorID, SensorName},
			{timestamp, erlang:system_time(seconds)},
			{sensor_unit, config_accesser:get_sensor_unit(SensorName)},
			{smart_mirror_ID, config_accesser:get_field(smart_mirror_ID)}
		],
	json:encode(M).
