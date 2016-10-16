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

cd /usr/bin/

# Download and install rebar3
wget https://s3.amazonaws.com/rebar3/rebar3 && chmod +x rebar3;

# Create a new Rebar project in the home directory.
cd /home
rebar3 new lib emqtcc_Group8;

# cd in to the new project directory
cd emqtcc_Group8;

# Change the rebar.config file + download and install emqttc 
cat /dev/null > rebar.config
echo {erl_opts, [debug_info]}. >> rebar.config
echo {deps, [{emqttc, {git, '"https://github.com/emqtt/emqttc.git"', {ref, '"815ebeca103025bbb5eb8e4b2f6a5f79e1236d4c"'}}}]}. >> rebar.config
rebar3 upgrade

# Clone the Erlang-Dev branch from github
git clone https://github.com/garzoc/GUSgroup8.git;

#Compile the .erl files
erlc mqttSender.erl
erlc json.erl
erlc value_generator.erl

#Start the rebar shell
rebar3 shell