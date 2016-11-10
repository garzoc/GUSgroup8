-module(sensor_package_sender).
-author("Isar Arason").
-export([start/0, send/1]).

% Starts a process using IP and port in config file
start() -> 
	case whereis(sender) of
		undefined ->
			{ok, Socket} = gen_tcp:connect(
				config_accesser:get_field(relay_ip),
				config_accesser:get_field(relay_port),
				[{mode, binary}]
			),
			Pid = spawn_link(fun() -> 
					loop(
					"", 
					erlang:system_time(seconds),
					Socket
				) end
			),
			register(sender, Pid);
		_ ->
			ok
	end,
	whereis(sender).

% Queues message for sending
send(Message) -> 
	sender ! Message.

% Receives messages. 
% If (now - LastTime) is 5 or greater, send queued messages
loop(Message, LastTime, Socket) ->
	
	% Add message to existing message
	receive
		M -> 
			NewMessage = Message ++ atom_to_list(M)
	end,
	
	% Check time difference and dispatch if exceeded
	I = erlang:system_time(seconds) - LastTime,
	if
		I >= 5 -> 
			dispatch(Message, Socket),
			loop("", erlang:system_time(seconds), Socket);
		true ->
			loop(NewMessage, LastTime, Socket)
	end.

dispatch(Message, Socket) ->

	io:format("Dispatched: ~p~n", [Message]),
	gen_tcp:send(Socket, Message).