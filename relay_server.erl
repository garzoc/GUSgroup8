-module(relay_server).
-export([init/1, start_link/0,find_topic/1]).
-behavior(gen_server).

% Start the relay server with the port defined above as defPort, also starts the connection
% to the Node.js server as well as the mqtt Broker.
start_link() -> 
     gen_server:start_link(?MODULE, [], []).	
	 
init([]) ->

	link(relay_node_sender:start()),
	
	register(mqttprocess, spawn_link(fun() -> connect_to_broker() end)), %broker

	{ok,Listensocket} = gen_tcp:listen(
		config_accesser:get_field(relay_listen_port),
		[binary,{packet,0},{active,false}]),
	
	spawn_link(fun() -> server_loop(Listensocket) end),
	
	spawn_link(fun() ->
		timer:sleep(10000),
		io:fwrite("~p", 1/0) end),
	
	{ok, relay_serverState}.

%% main server loop which waiting for the next connection, spawn child to handle it.	
server_loop(Listensocket) ->
	case gen_tcp:accept(Listensocket) of
		{ok,Socket} ->
			%io:format("hej"),
			spawn(fun()-> process(Socket) end),
			server_loop(Listensocket);
		{error,Reason} ->
			io:format("error in server loop~p", [Reason]),
			exit({accept,Reason})
	end.

%% handle current connection 	
process(Socket) -> 
	Err = do_recv(Socket),
	io:format("~p~n",[Err]),
	gen_tcp:close(Socket).

%% receive incomming data from socket (Sensor packages)
do_recv(Socket) ->
  case gen_tcp:recv(Socket, 0) of
    {ok, Bin} -> 
    	relay_sender!{ok, Bin}, %Send to Node.js
    	mqttprocess!{ok, Bin}; %Send to broker
    {error, closed} -> exit(closed);
    {error, econnrefused} -> exit(colsed);
    {error, Reason} -> exit(Reason)
  end.

% Loop for messages to send to Mqtt broker
mqtt_loop(Broker) ->
	receive
		{ok, Bin} -> send_to_broker(Broker, Bin);
		_ -> mqtt_loop(Broker)
	end.
	
% Connect to the mqtt broker
connect_to_broker() -> 
	{ok, Broker} = emqttc:start_link([
		%{host, "broker.hivemq.com"},
		{host, atom_to_binary(config_accesser:get_field(broker_host), utf8)},
		{port, config_accesser:get_field(broker_port)},
		%{port, 1883},
		%{client_id, <<"testClientEmanuel">>}]),
		{client_id, config_accesser:get_field(user)}]),
		mqtt_loop(Broker).

% get the topic information from sensor data% 
find_topic(Json) ->
%The line below does not works since the output dataformat of json:decode is atom, could you switch it list/tuple$
%"{sensor_package,PKG}, {user, USR}, {group, GRP},_,_,_,_,_"=atom_to_list(json:decode(Json)),
[{sensor_package,PKG}, {user, USR}, {group, GRP},_,_,_,_,_]=Json,
Topic = atom_to_list(GRP) ++ "/" ++ atom_to_list(USR) ++ "/" ++ atom_to_list(PKG),
list_to_binary(Topic).

% Send data to the Mqtt broker
send_to_broker(Broker, Data) -> 	
    	emqttc:publish(Broker, Topic, Data).
 
