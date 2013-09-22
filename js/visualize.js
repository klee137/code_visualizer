var vstorage ={};
var built_in =["int[]"];

function send(current){

        var objects ={};
        var relations =[];
        var primitives= {} ;
        var indicator="NA";

    if(current[0].primitive!=""){

        primitives["type"] = current[0].primitives;
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
            objects["capacity"] = current[current.indexOf("new")+3];
        }  
        //non built-in function
    }
    else if(current[0] in vstorage){
        //primitives
        if(!NaN(n=vstorage[current[0]]) || n==true || n==false){
            if(vstorage[current[2]] in vstorage){
                eval(vstorage[current[0]]=vstorage[current[2]]);
            } else{
                eval(vstorage[current[0]]=current[2]);
            }
        }
        //objects
        else{ 
            relations.push(current[0]);
            relations.push(current[2]);
            // 1 --> 2
        }
    }


    return {
        "primitives": primitives,
        "objects": objects,
        "relations": relations
    }
}


//vars = ["int", "x", "=", "0"]
function magic(vars){

    return {
        "primitives": [{"name": "x", "value": "0"}],
        "objects": [],
        "relations": []
    }
}


function findRefs(vars){

}

function round(numstring, cutoff){
    if(typeof numstring =="undefined"){
        return;
    }
	cutoff = cutoff || 8;
    console.log(numstring);
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
    fillGraph(vars);
    start()
}



var force;
// var svg = d3.select('#view')
//         .append("g");
var link, node;
var nodeCount = 0;

function start(){
  var width = window.innerWidth*.92,
      height = window.innerHeight;

  var color = d3.scale.category20();

  force = d3.layout.force()
      .gravity(.005)
      .distance(100)
      .charge(-50)
      .linkDistance(30)
      .size([width, height])
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

    //var svg = d3.select("body").append("svg")
    var svg = d3.select('svg')
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr('class', 'mainG')
        .call(d3.behavior.drag().on("drag", drag));



    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height);

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

    

    link = svg.selectAll(".link")
        .data(graph.links)
      .enter().append("line")
        .attr("class", "link");

    node = svg.selectAll(".node")
        .data(graph.nodes)
      .enter().append("g");

    node.append("rect")
        .attr("class", "node")
        .attr("height", 50)
        .attr("width", 50)
        .style("fill", function(d) { return color(d.group); })
        .attr("id", function(d){ return d.name })
        .on("click", function(d) {
            //clicking on a node changes it's style
            var self = $(this);
            $('.node').attr("class", "node");
            self.attr("class", "node selected");
            clickNode(d);
        });
        

    node.append("text")
        .attr("dx", 25)
        .attr("dy", "-1.0em")
        .text(function(d) { return d.name })
        


    force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    });
    
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


//takes an array of pieces
function fillGraph(vars){
    

    var shtml = $('#shelfList').html();
    var node;
    var type = vars[0];
    var name = round(vars[1], 10);
    var value = round(vars[3], 10);
    var isPrimitive = (type.primitive != "")? 1: 0;

    node = {
        "name": name,
        "type": type,
        "value": value,
        "group": isPrimitive
    }
    //add to shelf
    if (isPrimitive){
        shtml += "<li class='shelfItem'>"
        + name
        + "<div class='box'>"+value+"</div>"
        + "</li>";
    } else {
        shtml += "<li class='shelfItem'>"
        + name
        + "<div class='dot'>"+value+"</div>"
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







