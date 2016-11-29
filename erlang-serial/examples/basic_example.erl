-module(basic_example).

-export([test/0, get_channel/2, open/0, close/1, send/1, listen/0]).

test() ->
	{ok, SerialPort} = open(),
	spawn(fun() -> listen() end).

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
			
print_sensors([L|Ls]) ->
	{Name, Value} = L,
	io:fwrite("~p: ~p~n"),
	print_sensors(Ls);
	
print_list([]) -> ok.
  
listen() ->
	receive
		{data, Bytes} ->
			print_sensors(erl_parse(Bytes))
  after
    % Stop listening after 5 seconds of inactivity.
    5000 ->
      io:format("~n"),
      ok
  end.
