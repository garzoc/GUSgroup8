-module(sensor_monitor).
-author("Isar Arason").
-export([start/2]).

% Reads a value from the given pin and sends it to Sender
start(SensorList, Receiver) ->
	{ok, SerialPort} = read_serial:open("/dev/ttyUSB0"),
	Interval = config_accesser:get_field(sensor_interval),
	loop(SensorList, Receiver, SerialPort, Interval).
	
loop(SensorList, Receiver, SerialPort, Interval) ->
	read_all(Receiver, SerialPort, SensorList),
	timer:sleep(Interval),
	loop(SensorList, Receiver, SerialPort, Interval).

read_all(Receiver, SerialPort, [{SensorName, _, PinName} | Ls]) ->
	Receiver ! {SensorName, get_value(SerialPort, PinName)},
	read_all(Receiver, SerialPort, Ls);
	
read_all(_, _, []) -> ok.

get_value(SerialPort, PinName) ->
	% Todo - timeouts and error recovery
	SerialPort ! {send, PinName},
	receive
		{data, Bytes} ->
			Bytes
	after 
		5000 -> exit(timeout)
	end.
	% value_generator:generate_value().