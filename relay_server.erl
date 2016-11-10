-module(relay_server).
-export([start/0, start/1, process/1, connect_to_nodeServer/1, connect_to_broker/2]).
-define(defPort,1337).
-define(pFrequency,110).

%Start the relay server with the port defined above as defPort
start() -> start(?defPort).
start(Port) ->
	case gen_tcp:listen(Port,[binary,{packet,0},{active,false}]) of
		{ok,Listensocket} -> server_loop(Listensocket);
		{error,Reason} -> exit({Port,Reason})
	end.

%% main server loop which waiting for the next connection, spawn child to handle it.	
server_loop(Listensocket) ->
	case gen_tcp:accept(Listensocket) of
		{ok,Socket} ->
			io:format("hej"),
			spawn(fun()-> process(Socket) end),
			server_loop(Listensocket);
		{error,Reason} ->
			exit({accept,Reason})
	end.

%% handle current connection 	
process(Socket) -> 
	Err = do_recv(Socket, 0, 0),
	io:format("~p~n",[Err]),
	gen_tcp:close(Socket).

%% receive data from socket	
do_recv(Socket, NodeSocket, Broker) ->
  case gen_tcp:recv(Socket, 0) of
    {ok, <<"start">>} ->
    	%Connect to node server
    	io:format("connecting to node server"),
    	connect_to_nodeServer(Socket),
    	io:format("Node socket connected"),
    	timer:sleep(1000),

    	%Connect to mqtt broker
    	connect_to_broker(Socket, NodeSocket),
    	timer:sleep(1000);

    {ok, Bin} -> 
    	%send data to node.js server
    	send_to_nodeServer(NodeSocket, Bin),
    	%Send to the Mqtt broker
    	send_to_broker(Broker, Bin),
    	io:format("~p~n",[Bin]), 
    	do_recv(Socket, NodeSocket, Broker);

    	
    	%error messages
    {error, closed} -> exit(closed), connect_to_nodeServer(Socket);
    {error, econnrefused} -> exit(colsed), connect_to_nodeServer(Socket);
    {error, Reason} -> exit(Reason), connect_to_nodeServer(Socket)
  end.

% Connect to the node.js server
connect_to_nodeServer(Socket) -> 
	{ok, NodeSocket} = gen_tcp:connect({172,20,10,3}, 1337, [{mode, binary}]),
    Initmessage = "initProcess::{\"name\":\"hej\",\"type\":\"webServ\"}",
    gen_tcp:send(NodeSocket, Initmessage),
    do_recv(Socket, NodeSocket,0).

% Send data to the node.js server
send_to_nodeServer(NodeSocket, Data) ->
	gen_tcp:send(NodeSocket, Data).

% Connect to the mqtt broker
connect_to_broker(Socket, NodeSocket) -> 
	{ok, Broker} = emqttc:start_link([
		{host, "broker.hivemq.com"},
		{port, 1883},
		{client_id, <<"testClientEmanuel">>}]),
		do_recv(Socket, NodeSocket, Broker).

% Send data to the Mqtt broker
send_to_broker(Broker, Data) -> 	
    	emqttc:subscribe(Broker, <<"group8">>, 0),
    	emqttc:publish(Broker, <<"group8">>,Data), 
    		receive
        		{publish, Topic, Payload} ->
           		io:format("Message Received from ~s: ~p~n", [Topic, Payload])
   			after
        		5000 ->
            	io:format("Error: receive timeout!~n")
   			 end.
    	%emqttc:disconnect(C).





