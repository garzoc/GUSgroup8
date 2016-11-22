-module(read_serialPort).

-export([open/0, close/1, send/1, listen/0]).

% Opens connection. Specify the serialport you want to connect to.
open() ->
  SerialPort = serial:start([{open, "/dev/ttyUSB0"}, {speed, 9600}]),
  {ok, SerialPort}.

% Close connection to serialport
close(SerialPort) ->
  SerialPort ! {close},
  ok.
  
%Send data to the serialport
send(SerialPort) ->
  SerialPort ! {send, "Hello World\r\n"},
  ok.

% Read data from the serialport.
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