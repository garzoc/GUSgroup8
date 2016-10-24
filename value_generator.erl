%% This Module creates a generated sensorvalue and creates a String
%% with the value, the name and a timestamp in Unix time.

-module(value_generator).
-author("Emanuel Mellblom").
-export([generate_value/0, create_value/0, generate_id/0]).

generate_value() -> random:uniform(1023).

create_value() ->
  Value = generate_value(),
  Id = generate_id(),
  Time = erlang:system_time(),
  [{"value", Value},{"sensorID", Id},{"timestamp", Time}].

generate_id() ->
	X = random:uniform(5),
		case X of
			1 -> "temp";
			2 -> "co2";
			3 -> "barometric pressure";
			4 -> "humidity";
			5 -> "wind speed"
		end.
