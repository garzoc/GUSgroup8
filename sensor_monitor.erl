-module(sensor_monitor).
-author("Isar Arason").
-export([start/4]).

% Reads a value from the given pin and sends it to Sender
start(Reciever, SensorName, Pin, Interval) ->
	SerialPort = serial:start([{open, "/dev/ttyUSB0"}, {speed, 115200}]),
	loop(Reciever, SensorName, Pin, Interval, SerialPort).
	
loop(Receiver, SensorName, Pin, Interval, SerialPort) ->
	Receiver ! {SensorName, get_value(SerialPort, Pin)},
	timer:sleep(Interval),
	loop(Receiver, SensorName, Pin, Interval, SerialPort).
	
get_value(SerialPort, Pin) -> 
	% Todo - timeouts and error recovery
	SerialPort ! {send, Pin},
	receive
		{data, Bytes} ->
			Bytes
	end.
	% value_generator:generate_value().