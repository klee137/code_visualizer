//spot.js

Box = (function(){
	//Constructor
	function Box(radius, x, y){
		this.el = document.createElement('div');
		var radius = this.el.radius = parseFloat(radius) || 30;
		var x = this.el.x = x || Math.floor(Math.random()*window.innerWidth-radius);
		var y = this.el.y = y || Math.floor(Math.random()*window.innerHeight-radius);
		var r = Math.floor(Math.random()*255);
		var g = Math.floor(Math.random()*255);
		var b = Math.floor(Math.random()*255);
		var self = this.el;
		
		//initialize
		this.el.draw = function(){
			$(self).css({
				'position': 'absolute',
				'left': self.x,
				'top': self.y,
				'width': self.radius*2,
				'height': self.radius*2,
				'background-color': 'rgb('+r+','+g+','+b+')'
			});
		}
		this.el.draw();

		//size behavior
		this.el.grow = this.el.bigger = Box.prototype.grow;
		this.el.shrink = this.el.smaller = Box.prototype.shrink;
		this.el.fade = function(d, to){
			d = d || 10;
			to = parseFloat(to) || 0.01;
			var self = this;
			if (parseFloat($(this).css('opacity')) > to){
				$(this).css('opacity', '-=0.01');
				setTimeout(function(){
					self.fade();
				}, d);
			}
		}

		$('body').append(this.el);
		return this.el;
	}
	Box.prototype.grow = function(d){
		d = d || 20;
		$(this).css({
			'left': '-='+(d/2),
			'top': '-='+(d/2),
			'width': '+='+d,
			'height': '+='+d,
		});
		this.radius += d;
	}
	Box.prototype.shrink = function(d){
		d = d || 20;
		$(this).css({
			'left': '+='+(d/2),
			'top': '+='+(d/2),
			'width': '-='+d,
			'height': '-='+d,
		});
		this.radius -= d;
	}
	return Box;
})();


Dot = (function(){
	//constructor
	function Dot(radius, x, y){
		var radius = parseFloat(radius) || 30;
		var dot = Box(radius, x, y);
		$(dot).css({'border-radius': radius});

		dot.grow = function(d){
			d = d || 20;
			Box.prototype.grow.apply(this, arguments);
			$(this).css({'border-radius': '+='+d});
		}
		dot.shrink = function(d){
			d = d || 20;
			Box.prototype.shrink.apply(this, arguments);
			$(this).css({'border-radius': '-='+d});
		}
		return dot;
	}
	Dot.prototype = new Box();
	return Dot;
})();

bind = (function(){
	var events = {
		'mouseX': {
			eventName: 'mousemove',
			act: function(e){
				return e.pageX;
			}
		},
		'mouseY': {
			eventName: 'mousemove',
			act: function(e){
				return e.pageY;
			}
		},
		'space': {
			eventName: 'keyup',
			act: function(e){
				return (e.keyCode == 32);
			}
		},
		'enter': {
			eventName: 'keyup',
			act: function(e){
				return (e.keyCode == 13);
			}
		},
		'shift': {
			eventName: 'keyup',
			act: function(e){
				return (e.keyCode == 16);
			}
		},
		'ctrl': {
			eventName: 'keyup',
			act: function(e){
				return (e.keyCode == 17);
			}
		},
		'alt': {
			eventName: 'keyup',
			act: function(e){
				return (e.keyCode == 18);
			}
		}

	}
	function bind(one, prop, two){
		if (one !== undefined && two !== undefined){
			one = $(one);
			var action = events[two];
			if (action !== undefined){
				$(document).on(action['eventName'], function(e){
					var result = action['act'](e);
					//console.log(arguments.callee)
					//console.log(result);
					//if the result was boolean, use toggle
					if ( (result === true)||(result === false) ){
						$(one).css(prop, !$(one).css(prop) );
					} else {
						//normal value application
						$(one).css(prop, result);
					}
				});
			} else if (two.length == 1){		//probably a key binding to letter
				$(document).on('keyup', function(e){
					var result = false;
					if (e.keyCode == two.charCodeAt(0)){
						result = true;
					}

					//if the result was boolean, use toggle
					if ( (result === true)||(result === false) ){
						$(one).css(prop, !$(one).css(prop) );
					} else {
						//normal value application
						$(one).css(prop, result);
					}
				});
			} else {							//unrecognized event
				console.log('Sorry, I did not understand your event, ' + two);
			}
		}
	}

	//binds a function to an event
	function fnBind(fun, two){

	}

	return bind;
})();