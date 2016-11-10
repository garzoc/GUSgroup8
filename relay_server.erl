-module(relay_server).
-export([start/0, start/1, process/1, connect_to_nodeServer/0]).
-define(defPort,1337).
-define(pFrequency,110).

%Start the relay server with the port defined above as defPort
start() -> start(?defPort).
start(Port) -> 
	register(nodeprocess, connect_to_nodeServer()),
	case gen_tcp:listen(Port,[binary,{packet,0},{active,false}]) of
		{ok,Listensocket} -> server_loop(Listensocket);
		{error,Reason} -> exit({Port,Reason})
	end.

%% main server loop which waiting for the next connection, spawn child to handle it.	
server_loop(Listensocket) ->
	case gen_tcp:accept(Listensocket) of
		{ok,Socket} ->
			%io:format("hej"),
			spawn(fun()-> process(Socket) end),
			server_loop(Listensocket);
		{error,Reason} ->
			exit({accept,Reason})
	end.

%% handle current connection 	
process(Socket) -> 
	Err = do_recv(Socket),
	io:format("~p~n",[Err]),
	gen_tcp:close(Socket).

%% receive data from socket	
do_recv(Socket) ->
  case gen_tcp:recv(Socket, 0) of
    {ok, Bin} -> 
    	nodeprocess!{ok, Bin};
    {error, closed} -> exit(closed);
    {error, econnrefused} -> exit(colsed);
    {error, Reason} -> exit(Reason)
  end.


relay_loop(Socket) ->
	receive
		{ok, Bin} -> gen_tcp:send(Socket, Bin), relay_loop(Socket);
		_ -> relay_loop(Socket)
	end.

% Connect to the node.js server
connect_to_nodeServer() -> 
	{ok, NodeSocket} = gen_tcp:connect({172,20,10,3}, 1337, [{mode, binary}]),
    Initmessage = "initProcess::{\"name\":\"hej\",\"type\":\"package\"}",
    gen_tcp:send(NodeSocket, Initmessage),
    relay_loop(NodeSocket).
    %do_recv(Socket, NodeSocket,0).

% Send data to the node.js server
%send_to_nodeServer(NodeSocket, Data) ->
%	gen_tcp:send(NodeSocket, Data).

% Connect to the mqtt broker
%connect_to_broker(Socket, NodeSocket) -> 
%	{ok, Broker} = emqttc:start_link([
%		{host, "broker.hivemq.com"},
%		{port, 1883},
%		{client_id, <<"testClientEmanuel">>}]),
%		do_recv(Socket, NodeSocket, Broker).

% Send data to the Mqtt broker
%send_to_broker(Broker, Data) -> 	
 %   	emqttc:subscribe(Broker, <<"group8">>, 0),
  %  	emqttc:publish(Broker, <<"group8">>,Data), 
   % 		receive
    %    		{publish, Topic, Payload} ->
     %      		io:format("Message Received from ~s: ~p~n", [Topic, Payload])
   	%%		after
      %  		5000 ->
       %     	io:format("Error: receive timeout!~n")
   		%	 end.
    	%emqttc:disconnect(C).





