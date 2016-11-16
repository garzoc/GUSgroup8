-module(relay_supervisor).

-behaviour(supervisor).

-export([start_link/0, init/1]).

start_link() ->
	supervisor:start_link({global, ?MODULE}, ?MODULE, []).

init([]) ->
	io:format("~p (~p) starting...~n", [{global, ?MODULE}, self()]),

	RestartStrategy = one_for_one,
	MaxRestarts = 3,
	MaxSecondsBetweenRestarts = 5,
	Flags = {RestartStrategy, MaxRestarts, MaxSecondsBetweenRestarts},


	Restart = permanent,

	Shutdown = brutal_kill,

	Type = worker,

	% Spec of supervisor child
	ChildSpecifications = {relayServerId, {relay_server_test, start, []}, Restart, Shutdown, Type, [relay_server]},

	{ok, {Flags, [ChildSpecifications]}}.