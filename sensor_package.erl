-module(sensor_package).
-author("Isar Arason").
-export([start/0]).

% Set up processes for forwarding messages from the sensor processes to the relay
% Set up processes for reading each sensor defined in the config file and sending
% to the "forwarder"
% 	(just reading random data for now)

start() ->
	% Open socket -- used in loop
	sensor_package_sender:start(),
	% Grab all sensors
	Sensors = config_accesser:get_field(sensors),
	% Create a sensor monitor for each sensor
	Pid = spawn_link(fun () -> loop() end),
	[
		spawn_link(sensor_monitor, start, [Pid, Name, Pin, Interval]) || {Name, _, Pin, Interval} <- Sensors
	].
	

% Receive messages from the sensor monitors
loop() ->
	receive
		{SensorName, Value} ->
			sensor_package_sender:send(
			sensor_json_formatter:sensor_to_json(Value, SensorName)
			),
			loop()
	end.
