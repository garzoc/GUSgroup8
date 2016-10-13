-module(json).

-export([list_to_json/1]).

format_to_string(V) ->
	case {is_atom(V),is_integer(V),is_float(V)} of
			{true,_,_}->atom_to_list(V);
			{_,true,_}->integer_to_list(V);
			{_,_,true}->float_to_list(V,[{decimals,10},compact]);
			_->V
	end.
	
	
	
	
				
toJson([{Var,X}])->format_to_string(Var)++":"++format_to_string(X)++"}";
toJson([{Var,X}|L])->format_to_string(Var)++":"++format_to_string(X)++","++toJson(L);
toJson(_)->throw(formart_Error).
list_to_json(L)->"{"++toJson(L).


%toJson(Name,Li)-> string:join(string:join(atom_to_list(Name),"{"),string:join(toJson(Li),"}")).

%toJson(Li)-> atom_to_list(Name)++"{"++toJson(Li)++"}".
%json:list_to_json([{v,10},{t,l}]).