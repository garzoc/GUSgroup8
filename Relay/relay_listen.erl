-module(relay_listen).
-export([start/0,start/1,process/1]).
-define(defPort,1337).
-define(pFrequency,110).

start() -> start(?defPort).

start(Port) ->
	case gen_tcp:listen(Port,[binary,{packet,0},{active,false}, {reuseaddr, true}]) of
		{ok,Listensocket} -> server_loop(Listensocket);
		{error,Reason} -> exit({Port,Reason})
	end.
%% main server loop which waiting for the next connection, spawn child to handle it.	
server_loop(Listensocket) ->
	case gen_tcp:accept(Listensocket) of
		{ok,Socket} ->
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
	
send_times(0,_,_) ->ok;	
send_times(Acc, Data, Socket) -> 
    gen_tcp:send(Socket,Data), 
    timer:sleep(?pFrequency), %110
    send_times(Acc+1, Data, Socket).	
	

%% receive data from socket	
do_recv(Socket) ->  
  case gen_tcp:recv(Socket, 0) of  
    {ok, Bin} -> send_times(1,binary_to_list(Bin),Socket),do_recv(Socket);  
    {error, closed} -> exit(closed);  
    {error, Reason} -> exit(Reason)  
  end.  	
	
	
