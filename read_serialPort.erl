-module(read_serialPort).

-export([test/0, get_channel/2, open/0, close/1, send/1, listen/0]).

% test function
test() ->
  {ok, SerialPort} = open(),
  [Num| _] = "0",
  io:fwrite("~p",[Num]),
  timer:sleep(1000),
  io:fwrite("Ch0: ~p~n", get_channel(SerialPort, "0")).
  %io:fwrite("Ch1: ~p~n", get_channel(SerialPort, "1")),
  %io:fwrite("Ch2: ~p~n", get_channel(SerialPort, "2")),
  %io:fwrite("Ch3: ~p~n", get_channel(SerialPort, "3")).

% open a connection to the serial port
open() ->
  SerialPort = serial:start([{open, "/dev/cu.wchusbserial1410"}, {speed, 9600}]),
  {ok, SerialPort}.

% close the connection to the serial port
close(SerialPort) ->
  SerialPort ! {close},
  ok.
  
% send to serial port
send(SerialPort) ->
  SerialPort ! {send, "Hello World testing\r\n"},
  ok.

% get the channel of the serial port
get_channel(SerialPort, Num) ->
  SerialPort ! {send, Num},
  receive
    {data, Bytes} ->
      Bytes
  after 5000 -> ok
  end.
      

print_sensors([L|Ls]) ->
  {Name, Value} = L,
  io:fwrite("~p: ~p~n", [Name, Value]),
  print_sensors(Ls);
  
print_sensors([]) -> ok.

% listen for messages on the serial port
listen() ->
  receive
    % Receive data from the serial port on the caller's PID.
    {data, Bytes} ->
      {ok, M1, _} = erl_scan:string(binary_to_list(Bytes)),
      io:fwrite("~p", [M1]), % Bad term on line 55, fix it
      {ok, S1} = erl_parse:parse_term(M1),
      print_sensors(S1),
      listen()
  after
    % Stop listening after 5 seconds of inactivity.
    5000 ->
      io:format("~n"),
      ok
  end.