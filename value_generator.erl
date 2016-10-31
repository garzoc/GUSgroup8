%% This Module creates a random sensor value

-module(value_generator).
-author("Emanuel Mellblom").
-export([generate_value/0]).

generate_value() -> rand:uniform(1023).