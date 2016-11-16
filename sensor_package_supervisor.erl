-module(sensor_package_supervisor).
-author("Isar Arason").
-behaviour(supervisor).
-export([start_link/0, init/1]).

start_link() ->
     {ok, Pid} = supervisor:start_link({local, ?MODULE}, 
          ?MODULE, []),
     {ok, Pid}.

init([]) ->
	io:format("~p (~p) starting...~n", [{global, sensor_package}, self()]),
	
	
	RestartStrategy = one_for_one,
	MaxRestarts = 3,
	MaxSecondsBetweenRestarts = 5,
	Flags = {RestartStrategy, MaxRestarts, MaxSecondsBetweenRestarts},


	Restart = permanent,

	Shutdown = brutal_kill,

	Type = worker,

	% Spec of supervisor child
	ChildSpecifications = {sensor_package, {sensor_package, start_link, []}, Restart, Shutdown, Type, [sensor_package]},

	{ok, {Flags, [ChildSpecifications]}}.