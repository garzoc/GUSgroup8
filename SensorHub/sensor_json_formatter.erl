% Formats a JSON package to be sent to the relay server

-module(sensor_json_formatter).
-author("Isar Arason").
-export([sensor_to_json/2]).

% Returns a json message to be sent to the relay server.
sensor_to_json(Value, SensorName) ->
	M = [
			{group, config_accesser:get_field(group)},
			{user, config_accesser:get_field(user)},
			{sensor_hub, config_accesser:get_field(hub_name)},
			{sensorID, SensorName},
			{value, hd(Value)},
			{sensor_unit, config_accesser:get_sensor_unit(SensorName)},
			{timestamp, get_time()},
			{smart_mirror_ID, config_accesser:get_field(smart_mirror_ID)},
			{publish_to_broker, config_accesser:get_field(publish_to_broker)}
		],
json:encode(M).

	
get_time() ->
	{MegaSecs, Secs, _} = now(),
	MegaSecs * 1000000 + Secs.