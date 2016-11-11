-module(relay_server).
-export([start/0, start/1, process/1, connect_to_nodeServer/0, connect_to_broker/0]).
-define(defPort,1337).
-define(pFrequency,110).

% Start the relay server with the port defined above as defPort, also starts the connection
% to the Node.js server as well as the mqtt Broker.
start() -> start(?defPort).
start(Port) -> 
	io:fwrite("Initializing\n"),
	register(nodeprocess, spawn_link(fun() -> connect_to_nodeServer()end)),
	io:fwrite("Connected to node server\n"),
	register(mqttprocess, spawn_link(fun() -> connect_to_broker() end)), %broker
	io:fwrite("Connected to broker\n"),
	case gen_tcp:listen(Port,[binary,{packet,0},{active,false}]) of
		{ok,Listensocket} -> spawn_link(fun() -> server_loop(Listensocket) end);
		{error,Reason} -> exit({Port,Reason})
	end.

%% main server loop which waiting for the next connection, spawn child to handle it.	
server_loop(Listensocket) ->
	io:format("hej"),
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
    	nodeprocess!{ok, Bin}, %Send to Node.js
    	mqttprocess!{ok, Bin}; %Send to broker
    {error, closed} -> exit(closed);
    {error, econnrefused} -> exit(colsed);
    {error, Reason} -> exit(Reason)
  end.

% Loop for messages to send to Node server
nodejs_loop(Socket) ->
	receive
		{ok, Bin} -> gen_tcp:send(Socket, Bin), nodejs_loop(Socket);
		_ -> nodejs_loop(Socket)
	end.

% Loop for messages to send to Mqtt broker
mqtt_loop(Broker) ->
	receive
		{ok, Bin} -> send_to_broker(Broker, Bin);
		_ -> mqtt_loop(Broker)
	end.

% Connect to the node.js server
connect_to_nodeServer() -> 
	{ok, NodeSocket} = gen_tcp:connect({172,20,10,3}, 1337, [{mode, binary}]),
    Initmessage = "initProcess::{\"name\":\"hej\",\"type\":\"package\"}",
    gen_tcp:send(NodeSocket, Initmessage),
    nodejs_loop(NodeSocket).
    %do_recv(Socket, NodeSocket,0).

% Connect to the mqtt broker
connect_to_broker() -> 
	{ok, Broker} = emqttc:start_link([
		{host, "broker.hivemq.com"},
		{port, 1883},
		{client_id, <<"testClientEmanuel">>}]),
		mqtt_loop(Broker).

% Send data to the Mqtt broker
send_to_broker(Broker, Data) -> 	
    	emqttc:subscribe(Broker, <<"group8">>, 0),
    	emqttc:publish(Broker, <<"group8">>,Data).
    	%	receive
        %		{publish, Topic, Payload} ->
        % 		io:format("Message Received from ~s: ~p~n", [Topic, Payload])
   		%	after
        %		5 ->
        %   	io:format("Error: receive timeout!~n")
   		%	 end.
