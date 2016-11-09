-module(relay_listen).
-export([start/0,start/1,process/1]).
-define(defPort,1337).

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
		spawn(?MODULE,process,[Socket]),
		server_loop(Listensocket);
		{error,Reason} ->
		exit({accept,Reason})
	end.
%% handle current connection 	
process(Socket) -> 
	R = do_recv(Socket),
	io:format("~p~n",[R]),
	send_times(Acc,R,Socket),
	gen_tcp:close(Socket).
	
send_times(Acc, Data, Socket) -> 
    gen_tcp:send(Socket, atom_to_list(json:decode(value_generator:create_value()))), 
    timer:sleep(3000), %110
    send_times(Acc+1, Data, Socket).	
	

%% receive data from socket	
do_recv(Socket) ->  
  case gen_tcp:recv(Socket, 0) of  
    {ok, Bin} -> binary_to_list(Bin);  
    {error, closed} -> exit(closed);  
    {error, Reason} -> exit(Reason)  
  end.  	
	
	
