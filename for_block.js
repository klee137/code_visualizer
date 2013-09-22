function for_block(array_lines, vstorage){
	var start_index = [];
	var end_index = [];
	var temp = 0;
	var var_temp1 = 0;
	var var_temp2 = 0;
	var bool = 0;
	var rep_counter = 0;
	var return_lines = [];

	for(var a=0; a<array_lines.length; a++){
		for(var b=0; b<array_lines[a].length; b++){
			if(array_lines[a][b]==="for"){
				start_index.push(a);
			}
		}
	}
	for(var a=0; a<start_index.length; a++){
		temp=1;
		bool=1;
		for(var b=start_index[a]+1; bool; b++){
			for(var c=0; c<array_lines[b].length; c++){
				if(array_lines[b][c]==="{"){
					temp++;
				}else if(array_lines[b][c]==="}"){
					temp--;
				}
				if(temp==0){
					bool=0;
					end_index.push(b);
				}
			}
		}
	}

	var condition;
	var increment = "";
	var temp_cond = 0;

	for(var a=0; a<start_index.length; a++){
		temp = start_index[a];
		var b;
		for(b=2; !temp_cond; b++){
			if(array_lines[temp][b]==="int" || array_lines[temp][b]==="double" || array_lines[temp][b]==="String" || array_lines[temp][b]==="char" || array_lines[temp][b]==="Int" || array_lines[temp][b]==="boolean"){
				b++;
			}
			if(isNaN(array_lines[temp][b]) && isValid(array_lines[temp][b])){
				eval(array_lines[temp][b] +"="+ "2"); // vstorage[array_lines[temp1][b]].toString());
				temp_cond = 1;
				var_temp1 = temp;
				var_temp2 = b;
			}
		}
		
		while(array_lines[temp][b]!=";"){
			b++;
		}
		b++;
		condition = "";
		for(b; array_lines[temp][b]!==";"; b++){
			condition = condition + array_lines[temp][b];
		}
		b++;

		for(b; array_lines[temp][b+1]!=="{"; b++){
			increment = increment + array_lines[temp][b];
		}

		if(isValid(array_lines[var_temp1][var_temp2-1])){
			array_lines.splice(var_temp1+1, 0, [array_lines[var_temp1][var_temp2-1], array_lines[var_temp1][var_temp2], "=", vstorage[array_lines[var_temp1][var_temp2].toString
				]]);
		}else{
			array_lines.splice(var_temp1+1, 0, [array_lines[var_temp1][var_temp2], "=", vstorage[array_lines[var_temp1][var_temp2].toString
				]]);
		}

		while(eval(condition)){
			rep_counter++;
			eval(increment);
		}
	}

	for(var a=0; a<array_lines.length; a++){
		if(a==start_index[0]){
			temp = a+1;
			for(rep_counter; rep_counter>0; rep_counter--){
				for(var b=temp; b<end_index[0]; b++){
					return_lines.push(array_lines[b]);
				}
			}
			a=end_index[0]+1;
			start_index.slice(0,1);
			end_index.slice(0,1);
		}
		return_lines.push(array_lines[a]);
	}
	return return_lines;
}