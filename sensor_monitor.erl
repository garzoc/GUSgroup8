-module(sensor_monitor).
-author("Isar Arason").
-export([start/4]).

% Reads a value from the given pin and sends it to Sender
start(Reciever, SensorName, Pin, Interval) ->
	loop(Reciever, SensorName, Pin, Interval).
	
loop(Receiver, SensorName, Pin, Interval) ->
	Receiver ! {SensorName, get_value(Pin)},
	timer:sleep(Interval),
	loop(Receiver, SensorName, Pin, Interval).
	
get_value(Pin) -> 
	%% Todo: read from a pin %%
	value_generator:generate_value().