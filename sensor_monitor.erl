-module(sensor_monitor).
-author("Isar Arason").
-export([start/2]).

% Reads a value from the given pin and sends it to Sender
start(SensorList, Receiver) ->
	{ok, SerialPort} = read_serial:open(config_accesser:get_field(sensor_serial_port)),
	Interval = config_accesser:get_field(sensor_interval),

	io:fwrite("Sensor process started~n"),
	loop(SensorList, Receiver, SerialPort, Interval).
	
% May be improved by adding a queue for sensor - timing pairs
% where timed out sensors will be placed further back in the queue
loop(SensorList, Receiver, SerialPort, Interval) ->
	read_all(Receiver, SerialPort, SensorList),
	timer:sleep(Interval),
	loop(SensorList, Receiver, SerialPort, Interval).

read_all(Receiver, SerialPort, [{SensorName, _, PinName} | Ls]) ->
	Value = get_value(SerialPort, PinName),
	case Value of
		timeout ->
			ok;
		_ ->			
			io:fwrite("Received: ~p~n", [{SensorName, integer_to_list(hd(Value))}]),
			Receiver ! {SensorName, Value}
	end,

	read_all(Receiver, SerialPort, Ls);
	
read_all(_, _, []) -> ok.

get_value(SerialPort, PinName) ->
	% Todo - timeouts and error recovery
	SerialPort ! {send, PinName},
	receive
		{data, Bytes} ->
			binary:bin_to_list(Bytes)
	after 
		2000 -> 
			io:fwrite("Sensor reading timed out on pin ~p~n", [PinName]),
			timeout
	end.