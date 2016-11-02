
-module(erlang_tcp).
-export([test_tcp/1, send_times/3, init_server/0]).
 
% Start the node.js server 
init_server() ->
    {ok, Socket} = gen_tcp:connect({172,20,10,3}, 1337, [{mode, binary}]),
    Initmessage = "initProcess::{\"name\":\"hej\",\"type\":\"webServ\"}",
    gen_tcp:send(Socket, Initmessage),
    timer:sleep(5000),
    test_tcp(Socket).

% 
test_tcp(Socket) ->
    %init_server(),
    %timer:sleep(1500),
    %{ok, Socket} = gen_tcp:connect({172,20,10,3}, 1337, [{mode, binary}]),
    R = value_generator:create_value(),
    %Data = lists:flatten(atom_to_list(json:decode(R))),
    Data = atom_to_list(json:decode(R)),
    %io:format("~w~n",[json:decode(R)]),
    send_times(0, Data, Socket),


    gen_tcp:close(Socket).

% Specify how many times a message should be sent
send_times(15, Data, Socket) -> 
    gen_tcp:send(Socket, atom_to_list(json:decode(value_generator:create_value())));
send_times(Acc, Data, Socket) -> 
    %io:format("~w~n~n~n",[Data]),
    gen_tcp:send(Socket, atom_to_list(json:decode(value_generator:create_value()))), 
    timer:sleep(3000), %110
    send_times(Acc+1, Data, Socket).

% erlang_tcp:init_server().
% erlang_tcp:test_tcp().


