-module(mqttSender).
-export([start/0, publish/1, test/0]).

%qos_opt_test() ->
 %  ?assertEqual({0, emqttc:qos_opt(value_generator:create_value()})).

start() ->
	Pid = spawn_link(mqttSender, init, []),
	register(mqttSender, Pid).

%%% Something is broken beyond this point %%%
init() ->
	io:format("Initialized", []),
    {ok, Link} = emqttc:start_link([
                {host, config_accesser:get_field(broker_host)},
                {port, config_accesser:get_field(broker_port)},
                {client_id, <<"testClientEmanuel">>}]),
	
	loop(Link).
	
loop(Link) ->
	receive
		{Package, User, Group, Message} ->
			 
			%%%% This is probably incorrect %%%
			Topic = 
				atom_to_list(Group) ++ "/" 
				++ atom_to_list(User) ++ "/" 
				++ atom_to_list(Package),
			io:format("Test: ~p~n", [Topic]),
			% Needs verification
			emqttc:publish(Link,
				Topic,
				Message),
			loop(Link)
	end.

	
publish(Message) ->
	mqttSender ! Message.
	
	
 
test() ->
	start(),
	timer:sleep(1000),
	publish(
		{testSensorPackage, default, group8, 
			sensor_json_formatter:sensor_to_json(1, testSensor1)}
		).
	
