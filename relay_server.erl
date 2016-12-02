-module(relay_server).
-export([init/1, start_link/0,find_topic/1]).
-behavior(gen_server).

% Start the relay server with the port defined above as defPort, also starts the connection
% to the Node.js server as well as the mqtt Broker.
start_link() -> 
     gen_server:start_link(?MODULE, [], []).	
	 
init([]) ->

	link(relay_node_sender:start()),
	
	%register(mqttprocess, spawn_link(fun() -> connect_to_broker() end)), %broker

	{ok,Listensocket} = gen_tcp:listen(
		relay_config_accesser:get_field(relay_listen_port),
		[binary,{packet,0},{active,false}]),
	
	spawn_link(fun() -> server_loop(Listensocket) end),
	
	{ok, relay_serverState}.

%% main server loop which waiting for the next connection, spawn child to handle it.	
server_loop(Listensocket) ->
	case gen_tcp:accept(Listensocket) of
		{ok,Socket} ->
			spawn(fun()-> do_recv(Socket) end),
			server_loop(Listensocket);
		{error,Reason} ->
			io:format("error in server loop~p", [Reason]),
			exit({accept,Reason})
	end.

%% receive incomming data from socket (Sensor packages)
do_recv(Socket) ->
  case gen_tcp:recv(Socket, 0) of
    {ok, Bin} -> 
    	io:format("received tcp message~n"),
	process_message(Bin);
    {error, closed} -> exit(closed);
    {error, econnrefused} -> exit(colsed);
    {error, Reason} -> exit(Reason)
  end,
  do_recv(Socket).

% Loop for messages to send to Mqtt broker
mqtt_loop(Broker) ->
	receive
		{mqtt_msg, {Topic, Data}} -> send_to_broker(Broker, Topic, Data),
			mqtt_loop(Broker)
		after 5000 -> connect_to_broker()
	end.
	
% Connect to the mqtt broker
connect_to_broker() -> 
	{ok, Broker} = emqttc:start_nonelink([
		{host, relay_config_accesser:get_field(broker_host)},
		{port, relay_config_accesser:get_field(broker_port)},
		{client_id, relay_config_accesser:get_field(user)},
		{debug, none}]), % Changed this, might cause something to break.
		mqtt_loop(Broker).

% get the topic information from sensor data% 
find_topic(Data) ->
	[{sensor_package,PKG}, {user, USR}, {group, GRP},_,_,_,_,_] = json:decode(binary_to_list(Data)),
	Topic = GRP ++ "/" ++ USR ++ "/" ++ PKG,
	io:format("this is the topic~p~n", [Topic]),
	list_to_binary(Topic).

% Send data to the Mqtt broker
send_to_broker(Broker, Topic, Data) -> 	
    	emqttc:publish(Broker, Topic, Data).

% Format data for public broker
process_message(Data) ->
	[
		{sensor_package, Package},
		{user, User},
		{group, Group},
		{value, Value},
		{sensorID, SensorName},
		{timestamp, Timestamp},
		{sensor_unit, SensorUnit},
		_,
		{publish_to_broker, PubToBroker}
	] = json:decode(binary_to_list(Data)),
	
	case PubToBroker of
		true -> 
			Topic = Group ++ "/" ++ User ++ "/" ++ Package,
			% Format the data for public viewing
			MqttData = json:encode
			([
				{sensor_package, Package},
				{user, User},
				{value, Value},
				{sensorID, SensorName},
				{timestamp, Timestamp},
				{sensor_unit, SensorUnit}
			]),
			% Send formatted data and topic
			mqttprocess ! {mqtt_msg, {Topic, MqttData}};
		_ -> ok
	end,

    	relay_sender!{rly_msg, Data}. %Send to Node.js

% relay_supervisor:start_link().
% sensor_package_supervisor:start_link().
