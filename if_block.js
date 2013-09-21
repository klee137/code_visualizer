//output: array of lines without if statement
//make new array_lines, but don't add the if statements, making the new array_lines concise
//ONLY add the if statements whose conditions are true, without the if(){}
function if_block(array_lines,vstorage){
	var start_index =[];
	var end_index =[];
	var exclude_start =[];
	var exclude_end =[];
	var temp1=0;
	var statement;
	var return_lines =[];

	for(var a=0; a<array_lines.length; a++){
		for(var b=0; b<array_lines[a].length; b++){
			if(array_lines[a][b]==="if"){
				start_index.push(a);
			}
		}
	}

	for(var a=0; a<start_index.length; a++){
		temp1=1; //starts at 1 because if line contains open bracket
		for(var b=start_index[a]+1; b<start_index.length; b++){
			for(var c=0; c<array_lines[b].length; c++){
				if(array_lines[b][c]==="{"){
					temp1++;
				}else if(array_lines[b][c]==="}"){
					temp1--;
				}
				if(temp1==0){
					end_index.push(b);
				}
			}
		}
	}

	for(var a=0; a<start_index.length; a++){
		temp1 = start_index[a];
		statement = "";
		
		for(var b=2; array_lines[temp1][b]!==")"; b++){ //b=2 because first two elements are "if" and "("
			if(isNaN(array_lines[temp1][b]) && isValid(array_lines[temp1][b])){
				eval(array_lines[temp1][b] +"="+ vstorage[array_lines[temp1][b]].toString()); // vstorage[array_lines[temp1][b]].toString());
			}
			statement = statement + array_lines[temp1][b];
		}

		if(!eval(statement)){
			exclude_start.push(start_index[a]);
			exclude_end.push(end_index[a]);
		}
	}

	for(var a=0; a<array_lines.length; a++){
		if(a==start_index[0]){
			if(a==exclude_start[0]){
				a = exclude_end[0];
				exclude_end.slice(0,1);
				exclude_start.slice(0,1);
			}else{
				a++;
				start_index.slice(0,1);
				end_index.slice(0,1);
			}
		}
		return_lines.push(array_lines[a]);
	}

	return return_lines;
}