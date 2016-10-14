%% This Module creates a generated sensorvalue and creates a String
%% with the value, the name and a timestamp in Unix time.

-module(value_generator).
-author("Emanuel Mellblom").
-export([generate_value/0, create_value/0]).

generate_value() -> random:uniform(1023).

create_value() ->
  Value = generate_value(),
  Id = "temp",
  Time = erlang:system_time(),
  [{"value", Value},{"id", Id},{"time", Time}].
%	string:join([Id,Value,Time], "|").

%{"id", Id},{"time", Time}
