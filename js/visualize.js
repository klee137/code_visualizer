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
            alert(current);
            c= current[current.length-1].substring(current[current.length-1].indexOf("[")+1,current[current.length-1].indexOf("]"));
            objects["capacity"] = c;
        }  
        vstorage[objects["name"]]=objects;
        //non built-in function
    }
    else if(current[0] in vstorage){
        //primitives
        console.log("..");
        n=vstorage[current[0]];
        console.log(n);
        if(!isNaN(n) || n==true || n==false){
            console.log("testing");
            console.log(vstorage[current[2]]);
            if(current[2] in vstorage){
                console.log("?");
                eval(vstorage[current[0]]=vstorage[current[2]]);
            } else{
                console.log(vstorage[current[0]]+"="+current[2]);
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
    var link = {source: s, target: t, type: "link"};
    graph.nodes.push(link);
}

function round(numstring, cutoff){
    if (typeof numstring == "undefined"){
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
        for (var r=0; r<rel.length; r++){
            var relation = rel[r];
            graph.links.push(relation);
        }
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
        .attr("height", 20)
        .attr("width", 20)
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

// http://blog.thomsonreuters.com/index.php/mobile-patent-suits-graphic-of-the-day/
var links = [
  {source: "Microsoft", target: "Amazon", type: "licensing"},
  {source: "Microsoft", target: "HTC", type: "licensing"},
  {source: "Samsung", target: "Apple", type: "suit"},
  {source: "Motorola", target: "Apple", type: "suit"},
  {source: "Nokia", target: "Apple", type: "resolved"},
  {source: "HTC", target: "Apple", type: "suit"},
  {source: "Kodak", target: "Apple", type: "suit"},
  {source: "Microsoft", target: "Barnes & Noble", type: "suit"},
  {source: "Microsoft", target: "Foxconn", type: "suit"},
  {source: "Oracle", target: "Google", type: "suit"},
  {source: "Apple", target: "HTC", type: "suit"},
  {source: "Microsoft", target: "Inventec", type: "suit"},
  {source: "Samsung", target: "Kodak", type: "resolved"},
  {source: "LG", target: "Kodak", type: "resolved"},
  {source: "RIM", target: "Kodak", type: "suit"},
  {source: "Sony", target: "LG", type: "suit"},
  {source: "Kodak", target: "LG", type: "resolved"},
  {source: "Apple", target: "Nokia", type: "resolved"},
  {source: "Qualcomm", target: "Nokia", type: "resolved"},
  {source: "Apple", target: "Motorola", type: "suit"},
  {source: "Microsoft", target: "Motorola", type: "suit"},
  {source: "Motorola", target: "Microsoft", type: "suit"},
  {source: "Huawei", target: "ZTE", type: "suit"},
  {source: "Ericsson", target: "ZTE", type: "suit"},
  {source: "Kodak", target: "Samsung", type: "resolved"},
  {source: "Apple", target: "Samsung", type: "suit"},
  {source: "Kodak", target: "RIM", type: "suit"},
  {source: "Nokia", target: "Qualcomm", type: "suit"}
];

var nodes = {};

// Compute the distinct nodes from the links.
links.forEach(function(link) {
  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
});

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







