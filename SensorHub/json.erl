-module(json).
-export([decode/1,encode/1,list_to_array/2]).
-define(leftBrack,32).


is_valid_string(String)->case String==[X||X<-String,if is_integer(X)->true; true->false end] of true-> true; false-> false end.

%takes a list and foramts each value to a string and then merge the string
list_to_string([X])->json_value_format(X);
list_to_string([X|Xs])->json_value_format(X)++","++list_to_string(Xs);
list_to_string([])->[].

isAlphaNum(String) when is_list(String) ->
	case is_valid_string(String) of
    	true->
			case re:run(String, "^[0-9A-Za-z\s]+$") of
        		{match, _} -> true;
        		nomatch    -> false;
				_->false
    		end;
		_->false
	end;
	
isAlphaNum(_)->false.
%json:decode([{"k",49},{"l",40}]).
%formats value into strings
format_to_string(V) ->
	if
		
		is_atom(V)->atom_to_list(V);
		is_integer(V)->integer_to_list(V);
		is_float(V)->float_to_list(V,[{decimals,10},compact]);
		is_list(V)-> case isAlphaNum(V) of 
				false->"["++list_to_string(V)++"]";
				true->V 
			end;
		true->V
	end.
%json:decode([{"value",49},{"id","co2"},{"timestapm",23432}]).		
%Prevent numbers or lists from looking like a string when they later are formatted to an atom
json_value_format(V) ->
	case (is_number(V) orelse is_list(V)) andalso (isAlphaNum(V)==false) of
			true->format_to_string(V);
			false->"\""++format_to_string(V)++"\""
	end.
	
	
				
toJson([{Var,X}])->"\""++format_to_string(Var)++"\":"++json_value_format(X)++"}";
toJson([{Var,X}|L])->"\""++format_to_string(Var)++"\":"++json_value_format(X)++","++toJson(L);
toJson(_)->throw(format_Error).
encode(L)->list_to_atom("{"++toJson(L)).

%decode_toString

%Test
%io:format(json:decode([{v,10},{t,l}])).
%json:encode([{v,10},{t,l}]).
%json:encode([{v,10},{[10,[10,10]],[10,l,[l,10,[k,v]]]}]).
%json:encode([{"v",10},{t,l}]).%unsolved
%json:encode([{"v",10},{t,[tl]}]).

%Reverse the process

%reverse a list that has been turned into a string back to a list
list_to_array(Arr,[44|Xs])->[Arr]++list_to_array([],Xs);
list_to_array(Arr,[93|_])->[Arr];
list_to_array(Arr,[91|Xs])->list_to_array(Arr,Xs);
list_to_array(Arr,[X|Xs])->list_to_array(Arr++[X],Xs);
list_to_array(_,[])->[].

%key is always string might be uneccasary function
json_key_string(Key,[34|Xs])->{Key,Xs};
json_key_string(Key,[X|Xs])->json_key_string(Key++[X],Xs).

%process String
json_find_value(Value,34,[34|Xs])->{Value,Xs};
%process list
json_find_value(Value,93,[93|Xs])->case {[json_find_value_type(S)||S<-list_to_array([],"["++Value++"]")],Xs} of {[[]],Tail}->{[],Tail}; Else->Else end;
%process value
json_find_value(Value,32,[32|Xs])->{case re:run(Value,"^[0-9]*$") of nomatch-> Value;_->list_to_integer(Value) end,Xs};
json_find_value(Value,32,[44|Xs])->{case re:run(Value,"^[0-9]*$") of nomatch-> Value;_->list_to_integer(Value) end,","++Xs};
json_find_value(Value,32,[125|Xs])->{case re:run(Value,"^[0-9]*$") of nomatch-> Value;_->list_to_integer(Value) end,"}"++Xs};
%warning this ones doesn't retunr a tuple
json_find_value(Value,32,[])->case re:run(Value,"^[0-9]*$") of nomatch-> Value;_->list_to_integer(Value) end;
%process push to value placeholder and loop
json_find_value(Value,Type,[X|Xs])->json_find_value(Value++[X],Type,Xs).

%check if type is list or a value or string
%value is string return ->{Value found , remaining list}
json_find_value_type([34|Xs])->json_find_value([],34,Xs);
%loop
json_find_value_type([32|Xs])->json_find_value_type(Xs);
%value is list return ->{Value found , remaining list}
json_find_value_type([91|Xs])->json_find_value([],93,Xs);
%value is number return ->{Value found , remaining list}
json_find_value_type([X|Xs])->json_find_value([X],32,Xs);

json_find_value_type([])->[].

%look for colon
json_find_colon([58|Xs])->json_find_value_type(Xs);
json_find_colon([_|Xs])->json_find_colon(Xs).

%json has more fileds
json_find_end([44|Xs])->json_find_qote(Xs);
%json ends
json_find_end([125|_])->[];
%loop tp next character
json_find_end([X|Xs])->io:format("~p~n",[X]),json_find_end(Xs).

json_find_qote([34|Xs])->{Key,String}=json_key_string([],Xs),{Value,String2}=json_find_colon(String),[{list_to_atom(Key),Value}]++json_find_end(String2);
json_find_qote([_|Xs])->json_find_qote(Xs).

json_find_brack([123|Xs])->json_find_qote(Xs);
json_find_brack([X|Xs])->io:format("~p~n",[X]),json_find_brack(Xs);
json_find_brack(X)->io:format("~p",[X]).
decode(String)->json_find_brack(String).

