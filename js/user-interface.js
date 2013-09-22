//file upload
filepicker.setKey('AZvMTcVz3QlyB4oD2SsS8z');
function uploadFile(){
	filepicker.pick({
	    mimetypes: ['text/*'],
	  },
	  function(InkBlob){
	    filepicker.read(InkBlob, function(data){
		    $('textarea').val(data.trim());
		});
	  },
	  function(FPError){
	    console.log(FPError.toString());
	  }
	);
}

//hotkey 
$(document).keyup(function(e){
	if(e.keyCode==80 && $("textarea").css('display')==="none"){
		$("textarea").slideToggle(200);
	}
	if(e.keyCode==82 && $("textarea").css('display')==="none"){
		reset();
		go(0);
		playNote();
	}
	if(e.keyCode==78 && $("textarea").css('display')==="none"){
		if (lineI < lines.length){
			go(lineI);
	    	lineI++;
		}
	}
})


//open close the paste area
$('#pasteBtn').click(function(){
	$("textarea").slideToggle(200);
});
$("textarea").hide();
$('textarea').blur(function(){
	$('textarea').slideUp();
})
// $('.shelf').mouseenter(function(){
// 	//$('.shelfLeft, .shelfRight').css("background-color", "dimgray")
// })

// //shelf scrolling
// $('.shelf').mouseleave(function(){
// 	//$('.shelfLeft, .shelfRight').css("background-color", "gainsboro")
// })
$('.shelfLeft').click(function(){
	$('#shelfList').animate( { scrollLeft: '-=250' }, 200 );
})
$('.shelfRight').click(function(){
	$('#shelfList').animate( { scrollLeft: '+=250' }, 200 );
})


//clicking a shelfItem opens the detail window
$('.shelf').on('click', '.shelfItem', function(){
	//clear existing detail
	//$('#detail').hide().fadeIn();
	$('#detail').modal('toggle');

	var name = $(this).find(".classLabel").text().trim();
	var item = vstorage[name];

	var newHtml = "";
	for (var p in item){
		if (item.hasOwnProperty(p)){
			if (p == 0){
				newHtml += "<dt>value</dt>"
				+ "<dd>"+item[p]+"</dd>"
			} else {
				newHtml += "<dt>"+p+"</dt>"
				+ "<dd>"+item[p]+"</dd>"
			}
			
		}
	}

	$('#detailList').html(newHtml);

})

//displaying sets on space
var cover = false;
$(document).on('keyup', function(e){
	if (e.keyCode == 32 && $('.code').css('display') == "none"){
		$('#setList').slideToggle(150);
		$('.cover').fadeToggle(150, function(){
			if (!cover){
				$('.svgBox').addClass('blur');
			} else {
				$('.svgBox').removeClass('blur');
			}
			cover = !cover;
		});
		playNote();
	}
	// down button for the menu
	else if(e.keyCode == 40 && $('.code').css('display')=="none"){
		var name = $('.chosen').text().trim();
		var curr = $('.chosen');
		if(name !="Run"){
			curr.next().addClass('chosen');
			curr.removeClass('chosen');
			labels($('.chosen').text().trim());
		}
		playNote();
	}
	// up button for the menu
	else if(e.keyCode == 38 && $('.code').css('display')=="none"){
		var curr = $('.chosen');
		var name = $('.chosen').text().trim();
		if(name !="Code"){
			curr.prev().addClass('chosen');
			curr.removeClass('chosen');
			labels($('.chosen').text().trim());
		}
		playNote();
	}
	//enter key to hit enter
	else if(e.keyCode ==13 && $('.cover').css('display')=="block"){
		if($('.chosen').text().trim()=="Code"){

		}
		else if($('.chosen').text().trim()=="Paste"){
			$("textarea").slideToggle(200);
		}
		else if($('.chosen').text().trim()=="Upload"){
			uploadFile();
			$('#setList').slideToggle(150);
			$('.cover').fadeToggle(150, function(){
				if (!cover){
					$('.svgBox').addClass('blur');
				} else {
					$('.svgBox').removeClass('blur');
				}
				cover = !cover;
			});

		}
		else if($('.chosen').text().trim()=="Stats"){

		}
		else if($('.chosen').text().trim()=="Run"){
			run(lineI,lines.length);
			$('#setList').slideToggle(150);
			$('.cover').fadeToggle(150, function(){
				if (!cover){
					$('.svgBox').addClass('blur');
				} else {
					$('.svgBox').removeClass('blur');
				}
				cover = !cover;
			});

		}
	}

});
$('#settings, .cover').on('click', function(){
	if ($('.code').css('display') == "none"){
		$('#setList').slideToggle(150);
		$('.cover').fadeToggle(150, function(){
			if (!cover){
				$('.svgBox').addClass('blur');
			} else {
				$('.svgBox').removeClass('blur');
			}
			cover = !cover;
		});
		playNote();
	}
})


//choosing sets
$('.set').click(function(){
	var self = this;

	//unmark all others
	$('.set').removeClass('chosen');
	$(self).addClass('chosen');

	var name = $(self).text();
	if (name == "code"){

	}

	$('#setList').slideUp();
	$('.cover').fadeOut();

	playNote();
});
$('.set').hover(function(){

	var self = this;
	var label = $(self).text().trim();
	labels(label);
	
});

var context = new webkitAudioContext();

function run(LineI,endlength){
	setTimeout(function(){
		go(LineI);
		LineI++;

		if(LineI<endlength){
			run(LineI,endlength);
		}

	},250)
}


function labels(label){
	if (label == "Code"){
		$('#coverDetails').text("The Mind Projector is a visual code explorer made for MHacks Fall 2013.");
	} else if (label == "Paste"){
		$('#coverDetails').text("Paste your code.  Let us take care of it.  We're experts");
	} else if (label == "Upload"){
		$('#coverDetails').text("You left your code at home?!  Fine.  Just get it quickly.");
	} else if (label == "Stats"){
		var code = $('textarea').val().trim();
		var fors = (code.match(/for/g) || []).length;
		var ifs = (code.match(/if/g) || []).length;
		var whiles = (code.match(/while/g) || []).length;
		var classes = (code.match(/class/g) || []).length;
		var lines = $('textarea').val().trim().split('\n');
		lines = lines || [""];
		lines = lines.length - 1;

		var shtml = "Your code looks good. "+"<h1>"+lines+"</h1> wonderful lines";
		shtml += (fors > 0)? ("<br><h2>"+fors+"</h2> great for loops") : "";
		shtml += (ifs > 0)? ("<br><h2>"+ifs+"</h2> neat if statements") : "";
		shtml += (whiles > 0)? ("<br><h2>"+whiles+"</h2> while loops") : "";
		shtml += (classes > 0)? ("<br><h2>"+classes+"</h2> amazing classes") : "";

		$('#coverDetails').html(shtml);
	} else if (label == "Run"){
		$('#coverDetails').text("Experience the magic.");
	}


}
function playNote(){
	
	var	oscillator = context.createOscillator(); // Oscillator defaults to sine wave

	oscillator.connect(context.destination);
	oscillator.frequency.value = 1100;
	oscillator.start(0);
	requestAnimationFrame(function(){
		setTimeout(function(){
			console.log(oscillator.playbackState)
			oscillator.stop(0);
		}, 100);
	});
}



//zooming in and out of the SVG
function zoomin(scale){
	scale = scale || 1.2;
	var transform = $('.mainG').attr('transform');

	if (transform && transform.indexOf('scale') != -1){		//if scale has already been made
		var currScale = parseFloat(transform.split('scale')[1].replace("(","").replace(")",""), 10);
		if (isNaN(currScale)){
			console.log("Unable to parse the current zoom scale");
			return;
		}

		var newTrans = transform.split('scale')[0] + "scale(" + (currScale * scale) + ")";
		$('.mainG').attr('transform', newTrans);
	} else if (transform){									//no scale made yet, only translate
		var newTrans = transform + "scale("+scale+")";
		$('.mainG').attr('transform', newTrans);
	} else {												//transform not yet defined.  set translate to 0
		$('.mainG').attr('transform', 'translate(0)scale('+scale+')');
	}
}

function zoomout(scale){
	scale = scale || 1.2;
	var transform = $('g', '#view').attr('transform');

	if (transform && transform.indexOf('scale') != -1){		//if scale has already been made
		var currScale = parseFloat(transform.split('scale')[1].replace("(","").replace(")",""), 10);
		if (isNaN(currScale)){
			console.log("Unable to parse the current zoom scale");
			return;
		}

		var newTrans = transform.split('scale')[0] + "scale(" + (currScale / scale) + ")";
		$('.mainG').attr('transform', newTrans);
	} else if (transform){									//no scale made yet, only translate
		var newTrans = transform + "scale("+(1/scale)+")";
		$('.mainG').attr('transform', newTrans);
	} else {												//transform not yet defined.  set translate to 0
		$('.mainG').attr('transform', 'translate(0)scale('+(1/scale)+')');
	}
}