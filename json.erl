-module(json).

-export([decode/1]).

%takes a list and foramts each value to a string and then merge the string
list_to_string([X])->json_value_format(X);
list_to_string([X|Xs])->json_value_format(X)++","++list_to_string(Xs).

%formats value into strings
format_to_string(V) ->
	if
		is_atom(V)->atom_to_list(V);
		is_integer(V)->integer_to_list(V);
		is_float(V)->float_to_list(V,[{decimals,10},compact]);
		is_list(V)-> "["++list_to_string(V)++"]";
		true->V
	end.
		
%Prevent numbers or lists from looking like a string when they later are formatted to an atom
json_value_format(V) ->
	case is_number(V) orelse is_list(V) of
			true->format_to_string(V);
			false->"\""++format_to_string(V)++"\""
	end.	
	
	
				
toJson([{Var,X}])->"\""++format_to_string(Var)++"\":"++json_value_format(X)++"}";
toJson([{Var,X}|L])->"\""++format_to_string(Var)++"\":"++json_value_format(X)++","++toJson(L);
toJson(_)->throw(format_Error).
decode(L)->list_to_atom("{"++toJson(L)).

%Test

%json:decode([{v,10},{t,l}]).
%json:decode([{v,10},{[10,[10,10]],[10,l,[l,10,[k,v]]]}]).
