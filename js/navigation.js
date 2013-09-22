//navigation
var xc=yc=zc=yr=0;
var updown = 0;		// 1: up,  -1: down,  0: neither

$(document).keydown(function(e){
	if (e.keyCode == 37 || e.keyCode == 65)	//Left
		yr = 0.05;
	else if (e.keyCode == 38){	//Up
		xc = Math.sin(camera.rotation.y)*Math.cos(camera.rotation.x);
		yc = Math.sin(camera.rotation.x)*Math.cos(camera.rotation.y);
		zc = Math.cos(camera.rotation.y)*Math.cos(camera.rotation.x);
		
		updown = 1;
	} 
	else if (e.keyCode == 39 || e.keyCode == 68)	//Right
		yr = -0.05;
	else if (e.keyCode == 40){	//Down
		xc = -1*Math.sin(camera.rotation.y)*Math.cos(camera.rotation.x);
		yc = -1*Math.sin(camera.rotation.x)*Math.cos(camera.rotation.y);
		zc = -1*Math.cos(camera.rotation.y)*Math.cos(camera.rotation.x);
		
		updown = -1;
	}else if (e.keyCode == 83)		//S	'down'
		camera.position.y -= 15;
	else if (e.keyCode == 87)		//W	'up'
		camera.position.y += 15;
	
	//Added so that you can move forward + right at the same time
	if (updown == 1){
		xc = 1*Math.sin(camera.rotation.y)*Math.cos(camera.rotation.x);
		yc = 1*Math.sin(camera.rotation.x)*Math.cos(camera.rotation.y);
		zc = 1*Math.cos(camera.rotation.y)*Math.cos(camera.rotation.x);
	}else if (updown == -1){
		xc = -1*Math.sin(camera.rotation.y)*Math.cos(camera.rotation.x);
		yc = -1*Math.sin(camera.rotation.x)*Math.cos(camera.rotation.y);
		zc = -1*Math.cos(camera.rotation.y)*Math.cos(camera.rotation.x);
	}
});
$(document).keyup(function(e){
	if (e.keyCode == 38 || e.keyCode == 40){	//Up / Down
		updown = 0;
		xc=yc=zc = 0;
	}
	else if (e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 65 || e.keyCode == 68)		//left right
		yr = 0;
		
	//Added so that you can move forward + right at the same time
	if (updown == 1){
		xc = 1*Math.sin(camera.rotation.y)*Math.cos(camera.rotation.x);
		yc = 1*Math.sin(camera.rotation.x)*Math.cos(camera.rotation.y);
		zc = 1*Math.cos(camera.rotation.y)*Math.cos(camera.rotation.x);
	}else if (updown == -1){
		xc = -1*Math.sin(camera.rotation.y)*Math.cos(camera.rotation.x);
		yc = -1*Math.sin(camera.rotation.x)*Math.cos(camera.rotation.y);
		zc = -1*Math.cos(camera.rotation.y)*Math.cos(camera.rotation.x);
	}
});