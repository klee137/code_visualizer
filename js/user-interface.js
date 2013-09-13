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