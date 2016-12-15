-module(sensor_monitor).
-author("Isar Arason").
-export([start/2]).

% Reads a value from the given pin and sends it to Sender
start(SensorList, Receiver) ->
	{ok, SerialPort} = read_serial:open(config_accesser:get_field(sensor_serial_port)),
	io:fwrite("Sensor process started~n"),
	loop(SensorList, Receiver, SerialPort).
	
% Loop which reads through all sensors and sends to the main process
loop(SensorList, Receiver, SerialPort) ->
	read_all(Receiver, SerialPort, SensorList),
	timer:sleep(config_accesser:get_field(sensor_interval)),
	loop(SensorList, Receiver, SerialPort).

% Reads all sensors and sends to main process, followed by a dispatch message
read_all(Receiver, SerialPort, [{SensorName, _, PinName} | Ls]) ->
	Value = get_value(SerialPort, PinName),
	case Value of
		timeout ->
			ok;
		_ ->
			%io:fwrite("Received: ~p~n", [{SensorName, integer_to_list(hd(Value))}]),
			Receiver ! {SensorName, Value}
	end,

	read_all(Receiver, SerialPort, Ls);

read_all(Receiver, _, []) -> Receiver ! dispatch.

% Gets the value of a given sensor in a serial port
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