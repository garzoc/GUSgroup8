% Formats a JSON package to be sent to the relay server

-module(sensor_json_formatter).
-author("Isar Arason").
-export([sensor_to_json/2]).

% Returns a json message to be sent to the relay server.
sensor_to_json(Value, SensorName) ->
	M = [
			{'Group', config_accesser:get_field(group)},
			{'User', config_accesser:get_field(user)},
			{'Sensor_hub', config_accesser:get_field(hub_name)},
			{'SensorID', SensorName},
			{'Value', hd(Value)},
			{'Sensor_unit', config_accesser:get_sensor_unit(SensorName)},
			{'Timestamp', get_time()},
			{'Smart_mirror_ID', config_accesser:get_field(smart_mirror_ID)},
			{'Publish_to_broker', config_accesser:get_field(publish_to_broker)}
		],
json:encode(M).

	
get_time() ->
	{MegaSecs, Secs, _} = now(),
	MegaSecs * 1000000 + Secs.