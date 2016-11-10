-module(sensor_package).
-author("Isar Arason").
-export([start/0]).

% Set up processes for forwarding messages from the sensor processes to the relay
% Set up processes for reading each sensor defined in the config file and sending
% to the "forwarder"
% 	(just reading random data for now)

start() ->
	ok.