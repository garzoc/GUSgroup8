%% This Module creates a generated sensorvalue and creates a String
%% with the value, the name and a timestamp in Unix time.

-module(value_generator).
-author("Emanuel Mellblom").
-export([generate_value/0, create_value/0]).

generate_value() -> random:uniform(1023).

create_value() ->
  Value = erlang:integer_to_list(generate_value()),
  Id = "temp",
  Time = integer_to_list(erlang:system_time()),
  string:join([Id,Value,Time], "|").

