function system_print(array_lines, vstorage){
	var index;
	var println;
	var statement = "";

	for(var a=0; a<array_lines.length; a++){
		for(var b=0; b<array_lines.length; b++){
			if(array_lines[a][b]==="System" && array_lines[a][b+1]==="." && array_lines[a][b+2]==="out" && (array_lines[a][b+3]==="println" || array_lines[a][b+3]==="print"){
				if(array_lines[a][b+3]==="println"){
					println = 1;
				}else{
					println = 0;
				}
				b=b+5;
				while(array_lines[a][b!=")"){
					statement = statement + " "+ array_lines[a][b];
				}
			}
		}
	}
	if(println){
		statement = statement + "<br>";
	}
	print(statement);
}