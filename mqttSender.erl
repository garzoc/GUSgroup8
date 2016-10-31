-module(mqttSender).
-export([test/0]).

%qos_opt_test() ->
 %  ?assertEqual({0, emqttc:qos_opt(value_generator:create_value()})).

test() ->
    %V = value_generator:create_value(),
    %R = io_lib:format("~p",[value_generator:create_value()]),
    R = sensor_json_formatter:sensor_to_json(
		value_generator:generate_value(), testSensor1),
    %lists:flatten(R),
    io:format("print test ~p~n", [R]),
    V = json:decode(R),

    {ok, C} = emqttc:start_link([
                {host, "broker.hivemq.com"},
                {port, 1883},
                {client_id, <<"testClientEmanuel">>}]),
    emqttc:subscribe(C, <<"group8">>, 0),
    emqttc:publish(C, <<"group8">>,atom_to_binary(V,utf8)), %fun value_generator:create_value/0
    receive
        {publish, Topic, Payload} ->
            io:format("Message Received from ~s: ~p~n", [Topic, Payload])
    after
        5000 ->
            io:format("Error: receive timeout!~n")
    end,
    emqttc:disconnect(C),
    test().
