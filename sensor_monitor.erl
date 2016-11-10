-module(sensor_monitor).
-author("Isar Arason").
-export([start/3]).

% Reads a value from the given pin and sends it to Sender
start(Receiver, Pin, Interval) ->
	Receiver ! get_value(Pin),
	timer:sleep(Interval),
	start(Receiver, Pin, Interval).
	
get_value(Pin) ->
	%% Todo: read from a pin %%
	value_generator:generate_value().