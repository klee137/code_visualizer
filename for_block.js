function for_block(array_lines, vstorage){
	var code_array = array_lines;
	var start_index = [];
	var end_index = [];
	var temp = 0;
	var var_temp1 = 0;
	var var_temp2 = 0;
	var bool = 0;
	var rep_counter = 0;
	var return_lines = [];

	for(var a=0; a<code_array.length; a++){
		for(var b=0; b<code_array[a].length; b++){
			if(code_array[a][b]==="for"){
				start_index.push(a);
			}
		}
	}
	for(var a=0; a<start_index.length; a++){
		temp=1;
		bool=1;
		for(var b=start_index[a]+1; bool; b++){
			for(var c=0; c<code_array[b].length; c++){
				if(code_array[b][c]==="{"){
					temp++;
				}else if(code_array[b][c]==="}"){
					temp--;
				}
				if(temp==0){
					bool=0;
					end_index.push(b);
				}
			}
		}
	}

	var condition = [];
	var increment = [];
	var temp_cond = 0;
	var prim = 0;
	var v_string = "";
	vstorage[v_string] = 0;
	var values = [];
	bool = 0;

	for(var a=0; a<start_index.length; a++){
		temp = start_index[a];
		var b;
		for(b=2; !temp_cond; b++){
			if(code_array[temp][b].primitive()!="" && !bool){
				b++;
				v_string = code_array[temp][b];
				vstorage[v_string]=parseInt(code_array[temp][b+2]);

			}
			if(isNaN(code_array[temp][b]) && isValid(code_array[temp][b])){
				// if((y=array_lines[temp][b]) in vstorage){
				// 	console.log("reached here" + y);
				// 	console.log(vstorage[y]+"="+ vstorage[array_lines[temp][b]].toString());
				// 	eval(vstorage[y]+"="+ vstorage[array_lines[temp][b]].toString());	
				// } 
				
				temp_cond = 1;
				var_temp1 = temp;
				var_temp2 = b;
			}
		}
		
		while(code_array[temp][b]!=";"){
			b++;
		}
		b++;
		condition.push("");
		for(b; code_array[temp][b]!==";"; b++){
			condition[a] = condition[a] + code_array[temp][b];
		}
		b++;
		increment.push("");
		for(b; code_array[temp][b+1]!=="{"; b++){
			increment[a] = increment[a] + code_array[temp][b];
		}

		// if(isValid(code_array[var_temp1][var_temp2-1])){
		// 	code_array.splice(var_temp1+1, 0, [code_array[var_temp1][var_temp2-1], v_string, "=", vstorage[v_string].toString()]);
		// }else{
		// 	code_array.splice(var_temp1+1, 0, [v_string, "=", vstorage[v_string].toString()]
		// 		);
		// }

		// for(var d=0; d<end_index.length; d++){
		// 	if(start_index[d]>=var_temp1){
		// 		start_index[d]++;
		// 	}
		// 	if(end_index[d]>=var_temp1){
		// 		end_index[d]++;
		// 	}
		// }
		console.log(condition[a]);
		condition[a] = "vstorage[v_string]"+condition[a].substring(1,condition[a].length);
		values[a] = new Array(0);
		while(eval(condition[a])){
			rep_counter++;
			values[a].push(vstorage[v_string]);
			increment[a] = "vstorage[v_string]"+"=vstorage[v_string]+1";//increment.substring(1,increment.length);
			eval(increment[a]);
		}
	}
	
	for(var a=0; a<code_array.length; a++){
		var temp_temp = 0;
		if(a==start_index[0]){
			temp = a+1;
			for(rep_counter; rep_counter>0; rep_counter--){
				var temp_counter = 0;
				for(var b=temp; b<end_index[0]; b++){
					return_lines.push(["int", v_string, "=", temp_temp.toString()]);
					temp_temp++;
					return_lines.push(code_array[b]);
					temp_counter++;
				}
			}

			temp_temp = temp_temp + 1;
			a=end_index[0]+1;
			start_index.slice(0,1);
			end_index.slice(0,1);
		}
		return_lines.push(code_array[a]);
	}
	console.log(values);
	console.log(return_lines);
	return return_lines;
}