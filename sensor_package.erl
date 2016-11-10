-module(sensor_package).
-author("Isar Arason").
-export([start/0]).

% Set up processes for forwarding messages from the sensor processes to the relay
% Set up processes for reading each sensor defined in the config file and sending
% to the "forwarder"
% 	(just reading random data for now)

start() ->
	Sensors = config_accesser:get_field(sensors),
	Pid = spawn_link(fun () -> loop() end),
	[
		spawn_link(sensor_monitor, start, [Pid, {Name, Unit, Pin}, Interval]) || {Name, Unit, Pin, Interval} <- Sensors
	].
	
	
loop() ->
	
	receive
		{{SensorName, Unit, Pin}, Value} ->
			io:format("Received: ~p~n", [{{SensorName, Unit, Pin}, Value}]),
			loop();
		_ -> 
			io:format("Received: ~p~n", [undefined])
	after
		5000 -> 
			io:format("Received: ~p~n", [timeout])
	end.

% [{testSensor1,c,0},{testSensor2,f,1},{testSensor3,k,2}]
