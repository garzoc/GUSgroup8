-module(config_accesser).
-author("Emanuel Mellblom").
-export([get_field/1]).

% Open config file and find the value associated with the key
get_field(Field) ->
	{ok, File} =  file:consult("relay_config.conf"),
	get_field(Field, File).

get_field(Field, [{Field, B}|_]) -> B;

get_field(Field, [_|Ls]) -> 
	get_field(Field, Ls).
	