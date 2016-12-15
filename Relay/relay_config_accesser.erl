-module(relay_config_accesser).
-author("Emanuel Mellblom").
-export([get_field/1]).

% Opens the relay config file and finds the value associated with the key
get_field(Field) ->
	{ok, File} =  file:consult("relay_config.conf"),
	get_field(Field, File).

get_field(Field, [{A, B}|_]) when Field == A -> B;

get_field(Field, [_|Ls]) -> 
	get_field(Field, Ls).
	