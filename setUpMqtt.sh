#!/bin/bash

# cd to the directory where you want to have your project
# Add this file into that directory.
# then type chmod +x setUpMqtt.sh
# the type ./setUpMqtt  to start the installation

# Install erlang
# whereis erlc (Check if erlang is installed)
# sudo apt-get install erlang-ic (If erlang is not installed run this to install) 

# Make a Directory
mkdir mqttSender

# cd in to the new directory
cd mqttSender

# Download and install rebar3
git clone https://github.com/erlang/rebar3.git;
cd rebar3;
./bootstrap
PATH=~/bin/:$PATH;
chmod +x rebar3;

# Create a new Rebar project
rebar3 new lib emqtcc_Group8;

# cd in to the new project directory
cd emqtcc_Group8;

# Change the rebar.config file + download and install emqttc 
cat /dev/null > rebar.config
echo {erl_opts, [debug_info]}. >> rebar.config
echo {deps, [{emqttc, {git, '"https://github.com/emqtt/emqttc.git"', {ref, '"815ebeca103025bbb5eb8e4b2f6a5f79e1236d4c"'}}}]}. >> rebar.config
rebar3 upgrade

# Create a test file that can connect to a mqtt broker
cat > mqttSender.erl <<EOF
-module(mqttSender).
-export([test/1]).

test(Payload) ->
    {ok, C} = emqttc:start_link([
                {host, "broker.hivemq.com"},
                {port, 1883},
                {client_id, <<"testClientEmanuel">>}]),
    emqttc:subscribe(C, <<"group8">>, 0),
    emqttc:publish(C, <<"group8">>, <<"This is a test!">>),
    receive
        {publish, Topic, Payload} ->
            io:format("Message Received from ~s: ~p~n", [Topic, Payload])
    after
        5000 ->
            io:format("Error: receive timeout!~n")
    end,
    emqttc:disconnect(C).  

EOF

#Compile the mqttSender.erl file
erlc mqttSender.erl

#Start the rebar shell
rebar3 shell
