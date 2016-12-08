-module(sensor_package_sender).
-author("Isar Arason").
-export([start/0, send_message/1, connect/0]).

% Starts a process using IP and port in config file
start() -> 
	case whereis(package_sender) of
		undefined ->
			Pid = spawn_link(fun() -> 
					loop(
					"", 
					get_time(),
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
	
	% Check time difference and dispatch if excdispatch_intervaleeded
	I = get_time() - LastTime,
	DispatchInterval = (config_accesser:get_field(dispatch_interval) / 1000),
	if
		I >= DispatchInterval andalso (Message =/= []) -> 
			loop([], get_time(), dispatch(Message, Socket));
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
	% Split list and join swapped pieces
	% Approaches equal number of connections per valid relay
	Relays = config_accesser:get_field(relays),
	Index = trunc(random:uniform() * length(Relays)),
	{A, B} = lists:split(
				Index,
				Relays),
	connect(B ++ A).

% Loop through list of IPs
connect([{IP, Port} | Ls]) ->
	case gen_tcp:connect(
	IP, Port,
	[{mode, binary}]) of
		{ok, Socket} ->
			io:fwrite("Package | Successfully reconnected.~n", []),
			Socket;
		{error, Reason} ->
			io:fwrite("Package | Failed to connect to ~p, retrying. ~p~n", [{IP, Port}, Reason]),
			timer:sleep(2000),
			connect(Ls)
	end;

% Retry
connect([]) -> connect().

get_time() ->
	{MegaSecs, Secs, _} = now(),
	MegaSecs * 1000000 + Secs.




