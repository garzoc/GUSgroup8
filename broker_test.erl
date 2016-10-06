-module(broker_test).

-export(test/1]).

% Hardcoded IP for the time being
test(Payload) -> 
    {ok, C} = emqttc:start_link([
		{host, "broker.hivemq.com"},
		{port, 1883},
		{client_id, <<"testClient">>}]),
    emqttc:subscribe(C, <<"TestData">>, 0),
    emqttc:publish(C, <<"TestTopic">>, <<"This is a test!">>),
    receive
        {publish, Topic, Payload} ->
            io:format("Message Received from ~s: ~p~n", [Topic, Payload])
    after
        1000 ->
            io:format("Error: receive timeout!~n")
    end,
    emqttc:disconnect(C).