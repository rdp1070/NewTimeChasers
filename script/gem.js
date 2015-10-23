"use strict"

function makeGem(){
	var gem;
	return gem = {

		// Variables
		posX: Math.random() *(canvas.width - 10) + 10,
		posY :  Math.random() *(canvas.height - 10) + 10,
		size : 10,
		velocity : {
			x: 0,
			y: 0,
		},
		rotation: 0,
		speed : 0,
		top_speed : 0,

		// Static Variables
		MAX_SPEED : 5,
		MIN_SPEED : 0,
		DEFAULTX : canvas.width/2,
		DEFAULTY : canvas.height/2,

		// drawShip
		// * for now just draw a tiny green square that will
		// * be a place holder for the gem
		// * PLANNED
		// * import graphics for the gem and place it 
		// * in the appropriate position
		draw: function(_ctx){
			var ctx = _ctx;
			ctx.save();
			ctx.fillStyle = "green";
			ctx.beginPath();
			// temporary drawing of a green circle to represent the gem
			ctx.arc(this.posX,this.posY,this.size,0,2*Math.PI);
			ctx.fill();
			ctx.closePath();
			ctx.restore();
		},


		// collected
		// * randomize the location of collected thing
		// * return the score and time changes 
		collected: function(){

			this.posX = Math.random() *(canvas.width - 10) + 10;
			this.posY =  Math.random() *(canvas.height - 40) + 40;

			return { score: 100, timer: 0};
		},

		// randomize
		// * move to a random location
		randomize: function(){
			this.posX = Math.random() *(canvas.width - 10) + 10;
			this.posY =  Math.random() *(canvas.height - 40) + 40;
		},

		// move
		// * move the gem somehow
		move: function(shipX, shipY){
			return null;
		},

	}
}; 



