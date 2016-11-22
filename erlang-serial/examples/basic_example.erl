-module(basic_example).

-export([test/0, open/0, close/1, send/1, listen/0]).

test() ->
	{ok, SerialPort} = open(),
	io:printf("Ch0: ~p~n", get_channel(SerialPort, 0)),
	io:printf("Ch1: ~p~n", get_channel(SerialPort, 1)),
	io:printf("Ch2: ~p~n", get_channel(SerialPort, 2)),
	io:printf("Ch3: ~p~n", get_channel(SerialPort, 3)).

open() ->
  SerialPort = serial:start([{open, "/dev/ttyUSB0"}, {speed, 115200}]),
  {ok, SerialPort}.

close(SerialPort) ->
  SerialPort ! {close},
  ok.
  
send(SerialPort) ->
  SerialPort ! {send, "Hello World\r\n"},
  ok.

get_channel(SerialPort, Num) ->
	SerialPort ! {send, Num},
	receive
		{data, Bytes} ->
			Bytes
	end.
			
  
listen() ->
  receive
    % Receive data from the serial port on the caller's PID.
    {data, Bytes} ->
      io:format("~s", [Bytes]),
      listen()
  after
    % Stop listening after 5 seconds of inactivity.
    5000 ->
      io:format("~n"),
      ok
  end.
