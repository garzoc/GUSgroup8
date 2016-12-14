-module(sensor_hub_sender).
-author("Isar Arason").
-export([start/0, send_message/1, send_dispatch/0, connect/0]).

% Starts a process using IP and port in config file
start() -> 
	case whereis(hub_sender) of
		undefined ->
			Pid = spawn_link(fun() -> 
					loop(
					"", 
					get_time(),
					connect()
				) end
			),
			register(hub_sender, Pid);
		_ ->
			Pid = hub_sender
	end,
	Pid.

% Queues message for sending
send_message(Message) -> 
	hub_sender ! {pkg_msg, Message}.

% Queues a dispatch message indicating the collected data should be sent off
send_dispatch() ->
	hub_sender ! dispatch.

% Buffers incoming messages
loop(Message, LastTime, Socket) ->
	% Add message to existing message
	receive
		dispatch ->
			ok;
		{pkg_msg, M} -> 
			loop(Message ++ [M], LastTime, Socket)
	end,

	loop([], get_time(), dispatch(Message, Socket)).

% Sends a message. If socket doesn't work, try to reconnect until success.
dispatch(Message, Socket) ->
	io:fwrite("Hub | Sending message: ~n~p~n", [Message]),
	case gen_tcp:send(Socket, 
		[atom_to_binary(M, utf8) || M <- Message]) of
		{error, Reason} ->
			io:fwrite("Hub | Failed to dispatch, reconnecting.~p~n", [Reason]),
			dispatch(Message, connect());
		ok ->
			io:fwrite("Hub | Successfully dispatched.~n", []),
			Socket
	end.

% Tries to set up a connection until success
connect() ->
	% Split list and join swapped pieces
	% Approaches equal distribution of connections per valid relay
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
			io:fwrite("Hub | Successfully reconnected.~n", []),
			Socket;
		{error, Reason} ->
			io:fwrite("Hub | Failed to connect to ~p, retrying. ~p~n", [{IP, Port}, Reason]),
			timer:sleep(2000),
			connect(Ls)
	end;

% Retry
connect([]) -> connect().

% Returns current Unix time
get_time() ->
	{MegaSecs, Secs, _} = now(),
	MegaSecs * 1000000 + Secs.




