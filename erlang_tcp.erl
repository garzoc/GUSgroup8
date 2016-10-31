
-module(erlang_tcp).
-export([test_tcp/0, send_times/3]).
 
test_tcp() ->
    {ok, Socket} = gen_tcp:connect({172,20,10,3}, 1337, [{mode, binary}]),
    %Data = list_to_binary([25, "Hello"]),
    R = value_generator:create_value(),
    Data = list_to_binary([25, json:decode(R)]),
    send_times(0, Data, Socket),
    gen_tcp:close(Socket).

send_times(3, Data, Socket) -> 
    gen_tcp:send(Socket, Data);
send_times(Acc, Data, Socket) -> io:format("hej~n"),
    gen_tcp:send(Socket, Data), timer:sleep(110), 
    send_times(Acc+1, Data, Socket).