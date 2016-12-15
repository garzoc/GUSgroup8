-module(read_serial).

-export([open/1, get_channel/2]).

% open a connection to the serial port
open(SerialPortDirectory) ->
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