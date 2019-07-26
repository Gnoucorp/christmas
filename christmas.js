/**
 * Christmas plugin, based on jquery. Adds a customizable snow effect based on html5 canvas
 * 
 * Based on code sample from http://thecodeplayer.com/walkthrough/html5-canvas-snow-effect
 * 
 * @author gnoucorp
 *
 * https://gnoucorp.com
 */
if (typeof Object.create !== "function") {
    Object.create = function (obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}
(function ($, window, document) {
	function _christmas() {
		
	    var Christmas = {
	    	canvas: null,
	    	ctx: null,
	    	particlesCount: 0,
	    	particles: [],
	    	angle: 0,
	    	snowInterval: null,
	    	
	        init: function (options) {
	            var base = this;
	
	            base.options = $.extend({}, $.gcChristmas.options, options);
	
	            base.particles.splice();
	            
	            base.initCanvas();
	            
	            base.snow();
	            
	            base.bindWindow();
	        },
	        
	        initCanvas: function() {
	            var base = this;
	            
	        	// canvas init
	        	base.options.target.prepend('<canvas id="canvas" style="display: block; height: 100%; width: 100%; position: absolute; z-index: 3; pointer-events: none;"></canvas>');
	        	base.canvas = document.getElementById("canvas");
	        	base.ctx = base.canvas.getContext("2d");
	        	
	        	// canvas dimensions
	        	var W = window.innerWidth;
	        	var H = window.innerHeight;
	        	
	        	// FIX: remove margin of target element for the height
	        		
	    		var marginTop = parseInt(base.options.target.css('marginTop').replace('px', ''));
	    		var marginBottom = parseInt(base.options.target.css('marginBottom').replace('px', ''));
	    		H = H - marginTop - marginBottom;
	        	
	        	base.canvas.width = W;
	        	base.canvas.height = H;
	        },
	        
	        clear: function() {
	            var base = this;
	            
	            base.stop();
	            base.clearCanvas();
	            
	            base.particlesCount= 0;
	            base.particles.splice(0, base.particles.length);
	            base.angle = null;
	            base.snowInterval = null;
	        }, 
	        start: function() {
	            var base = this;
	            
	        	base.snow();
	        },
	        snow: function() {
	            var base = this;
	            
	            // init particles
	            if (base.particlesCount <= 0) {
	            	base.addFlakes(base.options.maxParticles);
	            }
	        	
	        	// animation loop
	        	switch (base.options.snowMode) {
	        	case 'flakes':
	        		base.snowInterval = setInterval(function() { 
	        			base.drawFlakes();
	        		}, base.options.refreshInterval);
	        		break;
	        	case 'circles':
	        		base.snowInterval = setInterval(function() { 
	        			base.drawCircles(); 
	        		}, base.options.refreshInterval);
	        		break;
	        	case 'images':
	        		base.snowInterval = setInterval(function() { 
	        			base.drawImages();
	        		}, base.options.refreshInterval);
	        		break;
	        	case 'custom':
	        		base.snowInterval = setInterval(function() { 
	        			base.drawCustom();
	        		}, base.options.refreshInterval);
	        		break;
	        	default:
	        		base.snowInterval = setInterval(function() { 
	        			base.drawFlakes(); 
	        		}, base.options.refreshInterval);
	        		break;
	        	}
	        },
	        
	        bindWindow: function() {
	            var base = this;
	
	            if (base.options.clickIncrement > 0) {
	            	$(window).on('click', function() {
	            		base.addFlakes(base.options.clickIncrement);
	            	});
	            }
	            
	            $(window).on('resize scroll', function() {
	            	// Reset canvas position
	            	$('#canvas').css('top', window.scrollY + 'px').css('left', window.scrollX + 'px');
	            });
	        },
	        
	        addFlakes: function(number) {
	            var base = this;
	            
	        	var W = window.innerWidth;
	        	var H = window.innerHeight;
	        	for(var i = 0; i < number; i++) {
	        		var particle = {
	        			x: window.scrollX + Math.random()*W, //x-coordinate
	        			y: window.scrollY + Math.random()*H, //y-coordinate
	        			r: Math.random()*base.options.maxFlakesSize+1, //radius
	        			d: Math.random()*Math.max(base.options.maxDensity, base.particlesCount) //density/speed
	        		};
	        		if (base.options.snowMode === 'images') {
	        			if (base.options.images.length > 1) {
	        				particle.i = Math.floor(Math.random() * base.options.images.length);
	        			} else {
	        				particle.i = 0; // 1 image => only use index 0
	        			}
	        		}
	        		base.particles.push(particle);
	        	}
	        	base.particlesCount = base.particlesCount + number;
	        },
	        
	        drawFlakes: function() {
	            var base = this;
	
	            base.clearCanvas();
	            
	    		base.ctx.beginPath();
	    		base.ctx.lineWidth = 2;
	    		base.ctx.lineCap = 'round';
	    		base.ctx.strokeStyle = base.options.snowColor;
	
	    		for(var i = 0; i < base.particlesCount; i++) {
	    			var p = base.particles[i];
	    			base.ctx.moveTo(p.x, p.y);
	
	    	        for(var count = 0; count < base.options.flakesSegments; count++) { 
	    	        	base.drawFlakeSegment(p, 2 * count * Math.PI / base.options.flakesSegments);
	    	        }
	    		}
	    		
	    		base.ctx.stroke();
	    		
	    		base.update();
	        },
	        
	    	drawFlakeSegment: function(p, segmentAngle) {
	            var base = this;
	            
	    		// Main segment
	    		var xa = p.x, ya = p.y;
	    		var xb = xa + Math.cos(segmentAngle) * p.r, yb = ya + Math.sin(segmentAngle) * p.r;
	    		
	    		base.ctx.moveTo(xa, ya);
	    		base.ctx.lineTo(xb, yb);
	    		
	    		var _smallSegmentsAngle = base.options.smallSegmentsAngle * 2 * Math.PI / 360;
	
	    		var xc = xa + Math.cos(segmentAngle) * p.r * base.options.smallSegmentsStart, yc = ya + Math.sin(segmentAngle) * p.r  * base.options.smallSegmentsStart;
	    		var xd = xc + Math.cos(segmentAngle + _smallSegmentsAngle) * p.r * base.options.smallSegmentsLength,
	    			yd = yc + Math.sin(segmentAngle + _smallSegmentsAngle) * p.r * base.options.smallSegmentsLength;
	
	    		var xe = xc + Math.cos(segmentAngle - _smallSegmentsAngle) * p.r * base.options.smallSegmentsLength,
	    			ye = yc + Math.sin(segmentAngle - _smallSegmentsAngle) * p.r * base.options.smallSegmentsLength;
	    		
	    		base.ctx.moveTo(xc, yc);
	    		base.ctx.lineTo(xd, yd);
	    		base.ctx.moveTo(xc, yc);
	    		base.ctx.lineTo(xe, ye);
	    	},
	        
	        drawCircles: function() {
	            var base = this;
	
	            base.clearCanvas();
	            
	            base.ctx.fillStyle = base.options.snowColor;
	            base.ctx.beginPath();
	            
	    		for(var i = 0; i < base.particlesCount; i++) {
	    			var p = base.particles[i];
	    			base.ctx.moveTo(p.x, p.y);
	    			base.ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
	    		}
	    		
	    		base.ctx.fill();
	    		
	    		base.update();
	        },
	        
	        drawImages: function() {
	            var base = this;
	
	            base.clearCanvas();
	            
	    		for(var i = 0; i < base.particlesCount; i++) {
	    			var p = base.particles[i];
	    			
	    			var _img = base.options.images[p.i];    			
	    			var img = new Image();
	    			img.src = _img.src;
	    			
	    			var _realW = p.r * _img.width / _img.ratio;
	    			var _realH = p.r * _img.height / _img.ratio;
	    			
	    			base.ctx.moveTo(p.x, p.y);
	    			base.ctx.drawImage(img, p.x - Math.round(_realW / 2), p.y - Math.round(_realH / 2), _realW, _realH);
	    		}
	    		
	    		base.update();
	        },
	        
	        drawCustom: function() {
	            var base = this;
	
	            base.clearCanvas();
	            
	            base.options.customDrawInit(base, base.ctx);
	            
	    		for(var i = 0; i < base.particlesCount; i++) {
	    			base.ctx.moveTo(p.x, p.y);
	                base.options.customDrawParticle(base, base.ctx, base.particles[i]);
	    		}
	    		
	            base.options.customDrawEnd(base, base.ctx);
	            
	    		base.update();
	        },
	        
	        update: function() {
	            var base = this;
	
	    		base.angle += 0.01;
	    		var W = window.innerWidth;
	    		var H = window.innerHeight;
	    		for(var i = 0; i < base.particlesCount; i++) {
	    			var p = base.particles[i];
	    			// Updating X and Y coordinates
	    			// We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
	    			// Every particle has its own density which can be used to make the downward movement different for each flake
	    			// Lets make it more random by adding in the radius
	    			p.y += Math.cos(base.angle+p.d) + 1 + p.r/2;
	    			p.x += Math.sin(base.angle) * 2;
	    			
	    			// Sending flakes back from the top when it exits
	    			// Lets make it a bit more organic and let flakes enter from the left and right also.
	    			if(p.x > W+5 || p.x < -5 || p.y > H) {
						// Probability of coming from right / left :
	    				// Deduced from the ratio of the added width (projection, according to height and current angle) on the full width (real + added)
	    				
	    				// <--------- FW ----------->
	    				// <------  W  -----><- AW ->
	    				// __________________ _ _ _
	    				// 				     |     /
	    				//                   |    /
	    				//                   |   /
	    				//                   |  /
	    				//                   | /
	    				//                   |/
	    				//               current snow angle
	
	    				// => R = AW / FW
	    				
						var addedWidth = H * Math.abs(Math.sin(base.angle));
						var fullWidth = W + addedWidth;
						var newX, newY;
						if (Math.random() > addedWidth / fullWidth) {
							newX = Math.random()*W;
							newY = -10;
	    				} else {
	    					newY = Math.random()*H;
	    					// If the flake is exitting from the right
	    					if(Math.sin(base.angle) > 0) {
	    						// Enter from the left
	    						newX = -5;
	    					} else {
	    						// Enter from the right
	    						newX = W+5;
	    					}
	    				}
    					base.particles[i] = $.extend(base.particles[i], {x: newX, y: newY});
	    			}
	    		}
	        },
	        
	        stop: function() {
	            var base = this;
	            
	        	if (base.snowInterval != null) {
	        		clearInterval(base.snowInterval);
	        	}
	        },
	        
	        clearCanvas: function() {
	            var base = this;
	            
	        	var W = window.innerWidth;
	        	var H = window.innerHeight;
	    		base.ctx.clearRect(0, 0, W, H);
	        }
	    };
	    
	    return Christmas;
	}
    $.gcChristmas = function (options) {
    	var christmas = Object.create(_christmas());
    	christmas.init(options);
    	return christmas;
    };

    $.gcChristmas.options = {
    	target: $('html'),
    	removeTargetMargin: true,
        snowColor: 'rgba(235, 235, 235, 0.8)',
        maxParticles: 20,
        clickIncrement: 7,
        maxFlakesSize: 10,
        refreshInterval: 40,
        maxDensity: 40,
        snowMode: 'flakes', // Available : 'circles', 'flakes', 'custom', 'images'
        flakesSegments: 6,
        smallSegmentsLength: 0.4,
        smallSegmentsStart: 0.6,
        smallSegmentsAngle: 30,
        customDrawInit: function(christmas, ctx) {},
        customDrawParticle: function(christmas, ctx, particle) {},
        customDrawEnd: function(christmas, ctx) {},
        images: [],
    };

}(jQuery, window, document));