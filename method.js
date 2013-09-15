function method(lineNum){
	this.method_name;
	this.start_line = lineNum;
	this.visibility_type = "default";
	this.is_static = 0;
	this.return_type;
	this.args;
	this.content_lines;


	for(i=0; i < retArray[lineNum].length; i++){
		if(retArray[lineNum][i]==="("){
			this.method_name = retArray[lineNum][i-1];
		}
	}

	var temp1 = 0;
	var temp2 = 0;
	for(i=0; i < retArray[lineNum].length; i++){
		temp2 = 0;
		if(retArray[lineNum][i]==="("){
			temp1 = 1;
			temp2 = i-1;
		}

		if(retArray[lineNum][i]==="public"){
			this.visibility_type = "public";
		}else if(retArray[lineNum][i]==="protected"){
			this.visibility_type = "protected";
		}else if(retArray[lineNum][i]==="private"){
			this.visibility_type = "private";
		}

		if(retArray[lineNum][i]==="static"){
			this.is_static = 1;
		}

		if(i < temp2 && !(retArray[lineNum][i]==="public"||retArray[lineNum][i]==="default"||retArray[lineNum][i]==="protected"||retArray[lineNum][i]==="private")){
			return_type = retArray[lineNum][i];
		}
	}

    temp1=0;
	for(i=temp2+2; retArray[lineNum][i] !== ")"; i=i+3;){
		this.args[temp1] = retArray[lineNum][i] + " " + retArray[lineNum][i+1];
		if(retArray[lineNum][i+2]===")"){
			break;
		}
		temp1++;
	}

	temp1 = 0;

	for(a=lineNum; i < retArray.length; i++){
		if(temp1=0 && a>lineNum){
			temp2 = a-1;
			break;
		}
		for(b=0; b < retArray[a].length; b++){
			if(retArray[a][b]=="("){
				temp1++;
			}else if(retArray[a][b]==")"){
				temp1--;
			}
		}
	}

	for(i = lineNum+1; i < temp2; i++){
		this.content_lines[temp1]=retArray[i];
		temp1++;
	}
}