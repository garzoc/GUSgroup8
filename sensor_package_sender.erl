-module(sensor_package_sender).
-author("Isar Arason").
-export([start/0, send/1]).

% Starts a process using IP and port in config file
start() -> 
	{ok, Socket} = gen_tcp:connect(
		config_accesser:get_field(relay_ip),
		config_accesser:get_field(relay_port),
		[{mode, binary}]
	),
	Pid = spawn(fun() -> 
			loop(
			[], 
			erlang:system_time(seconds),
			Socket
		) end
	),
	register(sender, Pid).

% Queues message for sending
send(Message) -> sender ! Message.

% Receives messages. 
% If (now - LastTime) is 5 or greater, send queued messages
loop(Message, LastTime, Socket) ->
	
	% Add message to existing message
	receive
		M -> Message = Message ++ M
	end,
	
	% Check time difference and dispatch if exceeded
	I = erlang:system_time(seconds) - LastTime,
	if
		I >= 5 -> dispatch(Message, Socket),
		LastTime = erlang:system_time(seconds),
		Message = []
	end,
	
	loop(Message, LastTime, Socket).

dispatch(Message, Socket) ->
	gen_tcp:send(Socket, Message).