%% This module converts sensor information into a JSON message

-module(sensor_json_formatter).
-author("Isar Arason").
-export([sensor_to_json/3]).

sensor_to_json(Value, Id, Timestamp) ->
	M = [{"value", Value}, {"sensorID", Id}, {"timestamp", Timestamp}],
	json:decode(M).