var vstorage ={};
var built_in =["int[]"];

function send(current){

        var objects ={};
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
        
        objects["type"] = current[0];
        objects["name"] = current[1];

        //built-in function
        if(objects["type"]=="int[]"){
            // alert(current);
            c= current[current.length-1].substring(current[current.length-1].indexOf("[")+1,current[current.length-1].indexOf("]"));
            objects["capacity"] = c;
            var values = [];
            for(var i=0;i<c;i++){
                values.push("0");
            }
            objects["content"] = values;
        }  
        vstorage[objects["name"]]=objects;
        //non built-in function
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


//vars = ["int", "x", "=", "0"]
//vars = ["x",".name", "=", "y", "+", "1"]

/*var vstorage = ...
function magic(vars){

    print()

    return {
        "primitives": [{"name": "x", "value": "0", "type": "int"}],
        "objects": [],
        "relations": []
    }
}
*/
function print(text){
    $('#console').append("<br>"+text);
}


function arrow(s, t){
    var link = {source: {"name": s}, target: {"name": t}, type: "link"};
    graph.links.push(link);
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
    if (!$.isEmptyObject(obj)){
        fillGraph(obj);
    }
    if (rel.length > 0){
        arrow(rel[0], rel[1])
    }

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

    start();
}



var force;
// var svg = d3.select('#view')
//         .append("g");
var link, node;
var nodeCount = 0;

function start(){
    $('svg').empty();
  var w = window.innerWidth*.92,
      h = window.innerHeight;

var color = d3.scale.category20();

var force = d3.layout.force()
    .nodes(graph.nodes)
    .links(graph.links)
    .size([w, h])
    .linkDistance(60)
    .charge(-300)
    .on("tick", tick)
    .start();

var svg = d3.select('svg')
        .attr("width", w)
        .attr("height", h)
        .append("g")
        .attr('class', 'mainG')
        .call(d3.behavior.drag().on("drag", drag));

     svg.append("rect")
        .attr("class", "overlay")
        .attr("width", w)
        .attr("height", h);

    function drag() {
        var d = d3.event;
        var curr = $('.mainG').attr("transform") || "translate(0,0)scale(1)";
        //curr = curr.replace("translate", "").replace("(", "").replace(")", "");
        curr = curr.replace("translate(","").replace(")","").replace(")","").split("scale(");
        var newX = parseFloat(curr[0].split(",")[0], 10) + parseFloat(d.dx, 10);
        var newY = parseFloat(curr[0].split(",")[1], 10) + parseFloat(d.dy, 10);
        var currScale = parseFloat(curr[1], 10);
      
        $('.mainG').attr("transform", "translate(" + newX + "," + newY + ")" + "scale("+ currScale +")");
    }

// Per-type markers, as they don't inherit styles.
svg.append("svg:defs").selectAll("marker")
    .data(["link", "licensing", "resolved"])
  .enter().append("svg:marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

var path = svg.append("svg:g").selectAll("path")
    .data(force.links())
  .enter().append("svg:path")
    .attr("class", function(d) { return "link " + d.type; })
    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

var circle = svg.append("svg:g").selectAll(".node")
    .data(force.nodes())
  .enter().append("g")
  .append("svg:circle")
    .attr("r", 6)
    .style("fill", function(d) { return color(d.group); })
        .attr("id", function(d){ return d.name })
        .on("click", function(d) {
          alert(1)
            //clicking on a node changes it's style
            var self = $(this);
            $('.node').attr("class", "node");
            self.attr("class", "node selected");
            clickNode(d);
        });
    //.call(force.drag);

var text = svg.append("svg:g").selectAll("g")
    .data(force.nodes())
  .enter().append("svg:g");

// A copy of the text with a thick white stroke for legibility.
text.append("svg:text")
    .attr("x", 8)
    .attr("y", ".31em")
    .attr("class", "shadow")
    .text(function(d) { return d.name; });

text.append("svg:text")
    .attr("x", 8)
    .attr("y", ".31em")
    .text(function(d) { return d.name; });

// Use elliptical arc path segments to doubly-encode directionality.
function tick() {
  path.attr("d", function(d) {
    console.log(d)
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy);
    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
  });

  circle.attr("transform", function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  });

  text.attr("transform", function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  });
}
    
}


//when a node is clicked
function clickNode(d){
    var name = d.name;

    //open up the detail window
    //$('#detail').modal('toggle');
}

// var graph = {
//     "nodes":[],
//     "links":[]
// }
var graph = {
    "nodes":[],
    "links":[]
}

// http://blog.thomsonreuters.com/index.php/mobile-patent-suits-graphic-of-the-day/


graph.nodes = nodes;
graph.links = links;




//takes an array of pieces
function fillGraph(vars){

    var shtml = $('#shelfList').html();
    var node;

    var type = vars['type'];
    var name = round(vars['name'], 10);
    var value = round(vars['value'], 10);
    var isPrimitive = (type.primitive() != "")? 1: 0;

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


    graph["nodes"].push(node);
    
    // for (var i in line){
    //     //check if class
    //     var n = {"name": line[i], "group": 1};
    //     graph["nodes"].push(n);

    //     //add to shelf
    //     shtml += "<li class='shelfItem'>"
    //         + line[i]
    //         + "</li>";
    // }

    $('#shelfList').html(shtml);
}


//parser







