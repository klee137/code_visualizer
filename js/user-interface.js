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
	$('.shelf').animate( { scrollLeft: '-=250' }, 200 );
})
$('.shelfRight').click(function(){
	$('.shelf').animate( { scrollLeft: '+=250' }, 200 );
})


//clicking a shelfItem opens the detail window
$('.shelf').on('click', '.shelfItem', function(){
	//clear existing detail
	//$('#detail').hide().fadeIn();
	$('#detail').modal('toggle');

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
})



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