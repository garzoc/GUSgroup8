-module(sensor_package).
-author("Isar Arason").
-export([init/1, start_link/0]).
-behavior(gen_server).
	
start_link() ->
     gen_server:start_link(?MODULE, [], []).	

init([]) ->
	% Start sender process
	link(sensor_package_sender:start()),
	% Grab all sensors
	Sensors = config_accesser:get_field(sensors),
	% Create a sensor monitor for each sensor
	Pid = spawn_link(fun () -> loop() end),
	spawn_link(sensor_monitor, start, [Sensors, Pid]),
	{ok, sensor_packageState}.

% Receive messages from the sensor monitors
loop() ->
	receive
		{SensorName, Value} ->
			sensor_package_sender:send_message(
			sensor_json_formatter:sensor_to_json(binary_to_list(Value), SensorName)
			),
			loop()
	end.
