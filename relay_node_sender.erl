-module(relay_node_sender).
-author("Isar Arason").
-export([start/0, send_message/1]).

% Starts a process using IP and port in config file
start() -> 
	case whereis(relay_sender) of
		undefined ->
			Pid = spawn_link(fun() -> 
					loop(
					connect()
				) end
			),
			register(relay_sender, Pid);
		_ ->
			Pid = relay_sender
	end,
	Pid.

% Queues message for sending
send_message(Message) -> 
	relay_sender ! {rly_msg, Message}.

% Sends tcp message
loop(Socket) ->
	% Add message to existing message
	receive
		{rly_msg, M} -> 
			loop(dispatch(M, Socket))
	end.

% Sends a message. If socket doesn't work, try to reconnect until success.
dispatch(Message, Socket) ->
	case gen_tcp:send(Socket, 
		[atom_to_binary(M, utf8) || M <- Message]) of
		{error, Reason} ->
			io:fwrite("Relay | Failed to dispatch, reconnecting.~p~n", [Reason]),
			dispatch(Message, connect());
		ok ->
			io:fwrite("Relay | Successfully dispatched.~n", []),
			Socket
	end.

% Tries to set up a connection until success
	connect() ->
	%io:format("hej"),
	%io:format("test relay node ip: ", [relay_config_accesser:get_field(node_ip)]),
	case gen_tcp:connect(relay_config_accesser:get_field(node_ip),
		config_accesser:get_field(node_port),
		[{mode, binary}]) of
		{ok, Socket} ->
			Initmessage = "initProcess::{\"name\":\"hej\",\"type\":\"package\"}",
			gen_tcp:send(Socket, Initmessage),
			io:fwrite("Relay | Successfully reconnected.~n", []),
			Socket;
		{error, Reason} ->
			io:fwrite("Relay | Failed to connect, retrying.~p~n", [Reason]),
			timer:sleep(2000),
			connect()
	end.







