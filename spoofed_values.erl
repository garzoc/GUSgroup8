-module(spoofed_values).
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
	spawn(fun() -> send_loop(0) end),
	Pid.
	
send_loop(FutureTime) ->
	send_message(
		sensor_to_json(random:uniform(), testSensor1, FutureTime)
	),
	send_message(
		sensor_to_json(random:uniform(), testSensor2, FutureTime)
	),
	send_message(
		sensor_to_json(random:uniform(), testSensor3, FutureTime)
	),
	timer:sleep(1000),
	io:fwrite("Sent with time ~p~n", [get_time() + FutureTime]),
	send_loop(FutureTime + 1008). % add 1008 seconds every second, 1 week every 10 mins
	
	
sensor_to_json(Value, SensorName, FutureTime) ->
	M = [
			{sensor_package, config_accesser:get_field(package)},
			{user, config_accesser:get_field(user)},
			{group, config_accesser:get_field(group)},
			{value, Value},
			{sensorID, SensorName},
			{timestamp, get_time() + FutureTime},
			{sensor_unit, config_accesser:get_sensor_unit(SensorName)},
			{smart_mirror_ID, config_accesser:get_field(smart_mirror_ID)},
			{publish_to_broker, config_accesser:get_field(publish_to_broker)}
		],
json:encode(M).
	
get_time() ->
	{MegaSecs, Secs, _} = now(),
	MegaSecs * 1000000 + Secs.
	
% Queues message for sending
send_message(Message) -> 
	relay_sender ! {rly_msg, Message}.

% Sends tcp message
loop(Socket) ->
	% Add message to existing message
	io:fwrite("loop~n"),
	receive
		{rly_msg, M} -> 
			io:fwrite("receive message~n"),
			loop(dispatch(M, Socket))
	end.

% Sends a message. If socket doesn't work, try to reconnect until success.
dispatch(Message, Socket) ->
	case gen_tcp:send(Socket, Message) of
		{error, Reason} ->
			io:fwrite("Relay | Failed to dispatch, reconnecting.~p~n", [Reason]),
			dispatch(Message, connect());
		ok ->
			io:fwrite("Relay | Successfully dispatched. ~p~n", [Message]),
			Socket
	end.

% Tries to set up a connection until success
	connect() ->
	%io:format("hej"),
	%io:format("test relay node ip: ", [relay_config_accesser:get_field(node_ip)]),
	case gen_tcp:connect({127,0,0,1},
		relay_config_accesser:get_field(node_port),
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
