-module(relay_node_sender).
-export([start/0, send_message/1]).

% Starts a process using IP and port in config file
start() -> 
	io:fwrite("starting~n"),
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
	% Add incoming message to existing message
	receive
		{rly_msg, M} -> 
			io:fwrite("Relay | Received message~n"),
			loop(dispatch(M, Socket))
	end.

% Sends a message. If socket doesn't work, try to reconnect until success.
dispatch(Message, Socket) ->
	case gen_tcp:send(Socket, Message) of
		{error, Reason} ->
			io:fwrite("Relay | Failed to dispatch, reconnecting.~p~n", [Reason]),
			dispatch(Message, connect());
		ok ->
			io:fwrite("Relay | Successfully dispatched.~n"),
			Socket
	end.

% Tries to set up a connection to the destination (Node.js server) until successful
connect() ->
	case gen_tcp:connect(relay_config_accesser:get_field(node_ip),
		relay_config_accesser:get_field(node_port),
		[{mode, binary}]) of
		{ok, Socket} ->
			% Init message used to set up the incoming connection
			Initmessage = "{\"use\":\"joinProcess\",\"context\":{\"serverId\":0}}",
			gen_tcp:send(Socket, Initmessage),
			io:fwrite("Relay | Successfully reconnected.~n", []),
			Socket;
		{error, Reason} ->
			io:fwrite("Relay | Failed to connect, retrying.~p~n", [Reason]),
			timer:sleep(2000),
			connect()
	end.