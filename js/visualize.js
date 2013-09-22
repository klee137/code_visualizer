var vstorage ={};
var built_in =["int[]"];

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function send(current){

    var objects =[];
    var relations =[];
    var primitives= {} ;
    var indicator="NA";

    if(current[0].primitive()!=""){

        primitives["type"] = current[0].primitive();
        primitives["name"] = current[1];
        if(current[2]=="="){
            primitives["value"]=current[3];
        } else{
            if(primitives["type"]=="boolean"){
                primitives["value"] = false;
            } else{
                primitives["value"] = 0;
            }
        }
        vstorage[primitives["name"]]=primitives["value"];
    }
    else if(built_in.indexOf(current[0])!=-1 && current.indexOf("new")!=-1){
        var obj = {};
        obj["type"] = current[0];
        obj["name"] = current[1];

        //built-in function
        if(obj["type"].endsWith("[]")){
            // alert(current);
            c= current[current.length-1].substring(current[current.length-1].indexOf("[")+1,current[current.length-1].indexOf("]"));
            obj["capacity"] = c;
            var values = [];
            for(var i=0;i<c;i++){
                values.push("0");
            }
            obj["content"] = values;
        }  
        vstorage[obj["name"]]=obj;
        //non built-in function


        var objData = {
            "name" : current[0],
            "type" : "pointer"
        };

        objects.push(obj);
        objects.push(objData);

        relations = [obj, objData];
    }
    else if(current[0] in vstorage || current[0].substring(0,current[0].indexOf("[")) in vstorage){
        //primitives
        n=vstorage[current[0]]; 
        if(current[0].indexOf("[")!=-1){
            n = vstorage[current[0].substring(0,current[0].indexOf("["))];
        }
        if(!isNaN(n) || n==true || n==false){
            if(current[2] in vstorage){
                eval(vstorage[current[0]]=vstorage[current[2]]);
            } else{
                console.log(vstorage[current[0]]+"="+current[2]);
                eval(vstorage[current[0]]=current[2]);
            }
        }
        //objects
        else{ 
            var arr = current.join("").substring(0, current.join("").indexOf("[")).trim();
            var index = current.join("").substring(current.join("").indexOf("[")+1,current.join("").indexOf("]")).trim();
            console.log(arr);
            console.log(index);
            if(current.indexOf("new") == -1){
              var temp= vstorage[arr].content;
              var number = current[current.length-1];
              if(isNaN(number)){
                var arr1 = current[current.indexOf("=")+1];
                arr1_name = arr1.substring(0,arr1.indexOf("["));
                arr1_index = arr1.substring(arr1.indexOf("[")+1,arr1.indexOf("]"));
                number = vstorage[arr1_name].content[arr1_index]; //array case

              }
              temp[index] = number;
              vstorage[arr].content=temp;
            } 
            else if(current.indexOf("new") != -1){
                //not do anything
            }
            else{
                relations.push(current[0]);
                relations.push(current[2]);
                // 1 --> 2                
            }

        }
    } else {
        var reserved = ["for", "if", "while", "else", "public", "private", "class"];
        if (current.length >= 2 && reserved.indexOf(current[0]) == -1 && current.indexOf("=") != -1){
            relations.push(current[0], current[current.length-1]);
        }
    }


    return {
        "primitives": primitives,
        "objects": objects,
        "relations": relations
    }
}


function print(text){
    $('#console').append("<br>"+text);
}


function arrow(s, t){
    // var newlink = {source: {"name":s}, target: {"name":t}, type: "suit"};
    console.log("link: " + s + " " + t)
    graph.addLink(s, t)

}

function round(numstring, cutoff){
    if (typeof numstring == "undefined"){
        return;
    }
	cutoff = cutoff || 8;
    var max = Math.pow(10, cutoff);
	if (!isNaN(parseInt(numstring ,10))){						//int
        if (parseInt(numstring ,10) > max){
            return (numstring + "").substr(0, cutoff) + "...";
        } else {
            return numstring;
        }
	} else if (!isNaN(parseFloat(numstring ,10))){				//float
        var str = (numstring + "")
        if (str.length > cutoff){
            return str.substr(0, cutoff) + "...";
        } else {
            return numstring;
        }
	} else if (numstring == "True" || numstring == "False"){	//boolean
        return numstring;
	} else if (numstring.length == 1){							//char
        return numstring;
	} else {													//string
        if (numstring.length > cutoff){
            return numstring.substr(0, cutoff) + "..."
        } else {
            return numstring;
        }
	}
}

function visualize(vars, references) {
    //clear
    var data = send(vars);
    var p = data["primitives"];
    var obj = data["objects"];
    var rel = data["relations"];

    //add primitive if needed
    if (!$.isEmptyObject(p)){
        fillGraph(p);
    }
    for (var i=0; i<obj.length; i++){
        if (obj.hasOwnProperty(i)){
            fillGraph(obj[i]);
        }
    }
    setTimeout(function(){
        if (rel.length > 0){
            arrow(rel[0]["name"], rel[1]["name"]);
        }
    }, 1100);
    

    //update the shelf
    var items = $('.shelfItem', '#shelfList');
    for (var i=0; i<items.length; i++){
        var item = $(items[i]);
        var name = item.find(".classLabel").text().trim();
        var newValue = vstorage[name];

        if (typeof newValue != "object"){
            item.find(".value").text(newValue);
        }
    }

    //start();
}


//when a node is clicked
function clickNode(d){
    var name = d.name;

    //open up the detail window
    //$('#detail').modal('toggle');
}




//takes an array of pieces
function fillGraph(vars){

    var shtml = $('#shelfList').html();
    var node;

    var type = vars['type'];
    var name = round(vars['name'], 10);
    var value = round(vars['value'], 10);
    var isPrimitive = (type.primitive() != "")? 1: 0;
    console.log(vars)
    console.log(name)
    graph.addNode(name);

    node = {
        "name": name,
        "type": type,
        "value": value,
        "group": isPrimitive
    }
    //add to shelf
    if (isPrimitive){
        shtml += "<li class='shelfItem'>"
        + "<div class='classLabel'>"+name+"</div>"
        + "<div class='box value'>"+value+"</div>"
        + "</li>";
    } else {
        shtml += "<li class='shelfItem'>"
        + "<div class='classLabel'>"+name+"</div>"
        + "<div class='dot value'></div>"
        + "</li>";
    }


    

    

    $('#shelfList').html(shtml);
}


//parser







