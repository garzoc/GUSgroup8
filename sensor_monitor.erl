-module(sensor_monitor).
-author("Isar Arason").
-export([start/3]).

% Reads a value from the given pin and sends it to Sender
start(Reciever, {SensorName, Unit, Pin}, Interval) ->
	loop(Reciever, {SensorName, Unit, Pin}, Interval).
	
loop(Receiver, {SensorName, Unit, Pin}, Interval) ->
	Receiver ! {{SensorName, Unit, Pin}, get_value(Pin)},
	timer:sleep(Interval),
	loop(Receiver, {SensorName, Unit, Pin}, Interval).
	
get_value(Pin) -> 
	%% Todo: read from a pin %%
	value_generator:generate_value().