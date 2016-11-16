-module(sensor_package_sender).
-author("Isar Arason").
-export([start/0, send_message/1]).

% Starts a process using IP and port in config file
start() -> 
	case whereis(package_sender) of
		undefined ->
			Pid = spawn_link(fun() -> 
					loop(
					"", 
					erlang:system_time(seconds),
					connect()
				) end
			),
			register(package_sender, Pid);
		_ ->
			Pid = package_sender
	end,
	Pid.

% Queues message for sending
send_message(Message) -> 
	package_sender ! {pkg_msg, Message}.

% Buffers incoming messages
% If (now - LastTime) is 5 or greater, send queued messages
loop(Message, LastTime, Socket) ->
	% Add message to existing message
	receive
		{pkg_msg, M} -> 
			NewMessage = Message ++ [M]
	end,
	
	% Check time difference and dispatch if exceeded
	I = erlang:system_time(seconds) - LastTime,
	if
		I >= 5 andalso (Message =/= []) -> 
			loop([], erlang:system_time(seconds), dispatch(Message, Socket));
		true ->
			loop(NewMessage, LastTime, Socket)
	end.

% Sends a message. If socket doesn't work, try to reconnect until success.
dispatch(Message, Socket) ->
	io:fwrite("Package | Sending message: ~n~p~n", [Message]),
	case gen_tcp:send(Socket, 
		[atom_to_binary(M, utf8) || M <- Message]) of
		{error, Reason} ->
			io:fwrite("Package | Failed to dispatch, reconnecting.~p~n", [Reason]),
			dispatch(Message, connect());
		ok ->
			io:fwrite("Package | Successfully dispatched.~n", []),
			Socket
	end.

% Tries to set up a connection until success
connect() ->
	case gen_tcp:connect(
	config_accesser:get_field(relay_ip),
	config_accesser:get_field(relay_port),
	[{mode, binary}]) of
		{ok, Socket} ->
			io:fwrite("Package | Successfully reconnected.~n", []),
			Socket;
		{error, Reason} ->
			io:fwrite("Package | Failed to connect, retrying.~p~n", [Reason]),
			timer:sleep(2000),
			connect()
	end.






