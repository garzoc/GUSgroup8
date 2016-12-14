-module(relay_server).
-export([init/1, start_link/0]).
-behavior(gen_server).

%% Start the relay with a supervisor
start_link() -> 
	% Uses the standard gen_server to restart the process if it crashes   
	gen_server:start_link(?MODULE, [], []).	
	 
%% Starts the connection to the Node.js server as well as the mqtt Broker.
init([]) ->
	% Starts the node.js sender and links it to the main process 
	% This allows the supervisor to re.start them both if one fails.
	link(relay_node_sender:start()),
	
	% Start the broker sender and link it to this process.
	% Registers the broker sender process to 'mqttprocess' for easy access
	
	case relay_config_accesser:get_field(support_broker) of
		true ->
			register(mqttprocess, spawn_link(fun() -> connect_to_broker() end)); %broker
		_ -> ok
	end,

	% Opens a listening socket for receiving messages from sensor hubs
	{ok,Listensocket} = gen_tcp:listen(
		relay_config_accesser:get_field(relay_listen_port),
		[binary,{packet,0},{active,false},{reuseaddr, true}]),
	
	% Starts a process for handling listening and processing of incoming data
	spawn_link(fun() -> server_loop(Listensocket) end),
	
	{ok, relay_serverState}.

%% Loop which waits for incoming connections and spawn child to handle it.	
server_loop(Listensocket) ->
	case gen_tcp:accept(Listensocket) of
		{ok,Socket} ->
			spawn(fun()-> do_recv(Socket) end),
			server_loop(Listensocket);
		{error,Reason} ->
			io:format("error in server loop~p", [Reason]),
			exit({accept,Reason})
	end.

%% Receive incomming data from socket (Sensor packages)
do_recv(Socket) ->
  case gen_tcp:recv(Socket, 0) of
    {ok, Bin} -> 
	% If a message is received, handle it in process_message
	spawn(fun() -> process_message(Bin) end);
    {error, closed} -> exit(closed);
    {error, econnrefused} -> exit(closed);
    {error, Reason} -> exit(Reason)
  end,
  do_recv(Socket).

% Loop for messages to send to Mqtt broker
mqtt_loop(Broker) ->
	receive
		{mqtt_msg, {Topic, Data}} -> send_to_broker(Broker, Topic, Data),
			mqtt_loop(Broker)
		after 5000 -> connect_to_broker()
	end.
	
% Connect to the mqtt broker
connect_to_broker() -> 
	{ok, Broker} = emqttc:start_nonelink([
		{host, relay_config_accesser:get_field(broker_host)},
		{port, relay_config_accesser:get_field(broker_port)},
		{client_id, relay_config_accesser:get_field(user)},
		{debug, none}]), % Changed this, might cause something to break.
		mqtt_loop(Broker).

% Send data to the Mqtt broker
send_to_broker(Broker, Topic, Data) -> 	
    	emqttc:publish(Broker, Topic, Data).

% Format data for public broker
process_message(Data) ->

	% Forward the data to the Node.js server
    	relay_sender!{rly_msg, Data},
	
	case relay_config_accesser:get_field(support_broker) of
		true -> 
		% Unpack the received data 
		[
			{group, Group},
			{user, User},
			{sensor_hub, Hub_name},
			{sensorID, SensorName},
			{value, Value},
			{sensor_unit, SensorUnit},
			{timestamp, Timestamp},
			_,
			{publish_to_broker, PubToBroker}
		] = json:decode(binary_to_list(Data)),
	
		% If the incoming message wants to be sent to the broker as well
		case PubToBroker of
			true -> 
				Topic = Group ++ "/" ++ User ++ "/" ++ Hub_name,

				% Reormat and encode the data for public viewing
				MqttData = json:encode
				([
					{'Group', Group},
					{'User', User},
					{'Sensor_hub', Hub_name},
					{'SensorID', SensorName},
					{'Value', Value},
					{'Sensor_unit', SensorUnit},
					{'Timestamp', Timestamp}
				]),

				% Send formatted data and topic
				mqttprocess ! {mqtt_msg, {Topic, MqttData}};
			_ -> ok
		end;
		_ ->
			ok
	end.


% relay_supervisor:start_link().
% sensor_package_supervisor:start_link().