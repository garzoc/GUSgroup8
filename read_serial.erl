-module(read_serial).

-export([test/0, open/1, get_channel/2]).

%todo 

test() ->
  {ok, SerialPort} = open("/dev/cu.wchusbserial1410"),
  timer:sleep(500), % Just in case, may not be necessary
  io:fwrite("Ch0: ~p~n", get_channel(SerialPort, "0")).
  %io:fwrite("Ch1: ~p~n", get_channel(SerialPort, "1")),
  %io:fwrite("Ch2: ~p~n", get_channel(SerialPort, "2")),
  %io:fwrite("Ch3: ~p~n", get_channel(SerialPort, "3")).

% open a connection to the serial port
open(SerialPortDirectory) ->
	% SP ex.: "/dev/cu.wchusbserial1410"
  SerialPort = serial:start([{open, SerialPortDirectory}, {speed, 9600}]),
  {ok, SerialPort}.

% get the channel of the serial port
get_channel(SerialPort, PinName) ->
  SerialPort ! {send, PinName},
  receive
    {data, Bytes} ->
      binary_to_list(Bytes)
  after 5000 -> timeout
end.