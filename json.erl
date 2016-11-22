-module(json).

-export([decode/1,encode/1]).
-define(leftBrack,32).


%takes a list and foramts each value to a string and then merge the string
list_to_string([X])->json_value_format(X);
list_to_string([X|Xs])->json_value_format(X)++","++list_to_string(Xs).

isAlphaNum(String) when is_list(String) ->
    case re:run(String, "^[0-9A-Za-z\s]+$") of
        {match, _} -> true;
        nomatch    -> false;
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
decode(L)->list_to_atom("{"++toJson(L)).

%decode_toString

%Test
%io:format(json:decode([{v,10},{t,l}])).
%json:decode([{v,10},{t,l}]).
%json:decode([{v,10},{[10,[10,10]],[10,l,[l,10,[k,v]]]}]).
%json:decode([{"v",10},{t,l}]).%unsolved

%Reverse the process

%key is always string might be uneccasary function
json_key_string(Key,[34|Xs])->{Key,Xs};
json_key_string(Key,[X|Xs])->json_key_string(Key++[X],Xs).

%process String
json_find_value(Value,34,[34|Xs])->{Value,Xs};
%process list
json_find_value(Value,93,[93|Xs])->{Value++"]",Xs};
%process value
json_find_value(Value,32,[32|Xs])->{Value,Xs};
json_find_value(Value,32,[44|Xs])->{Value,","++Xs};
json_find_value(Value,32,[125|Xs])->{Value,"}"++Xs};
%process push to value placeholder and looå
json_find_value(Value,Type,[X|Xs])->json_find_value(Value++[X],Type,Xs).

%check if type is list or a value or string
json_find_value_type([34|Xs])->json_find_value([],34,Xs);
json_find_value_type([32|Xs])->json_find_value_type(Xs);
json_find_value_type([91|Xs])->json_find_value([91],93,Xs);
json_find_value_type([X|Xs])->json_find_value([X],32,Xs).

%look for colon
json_find_colon([58|Xs])->json_find_value_type(Xs);
json_find_colon([_|Xs])->json_find_colon(Xs).

%json has more fileds
json_find_end([44|Xs])->json_find_qote(Xs);
%json ends
json_find_end([125|_])->[];
%loop tp next character
json_find_end([X|Xs])->io:format("~p~n",[X]),json_find_end(Xs).

%this might also be an unessacary functions that can be moved down to json_find_bracket
json_find_qote([34|Xs])->{Key,String}=json_key_string([],Xs),{Value,String2}=json_find_colon(String),[{Key,Value}]++json_find_end(String2);
json_find_qote([_|Xs])->json_find_qote(Xs).

json_find_brack([123|Xs])->json_find_qote(Xs);
json_find_brack([X|Xs])->io:format("~p~n",[X]),json_find_brack(Xs);
json_find_brack(X)->io:format("~p",[X]).
encode(String)->json_find_brack(String).

%json:encode(list_to_atom("{\"hej\":\"hej\"}")).
%json:encode("{\"hej\":\"hej\"}").

%{ok,_}=file:consult("/Users/john/Desktop/test.conf"),json:read(json:start(),)


