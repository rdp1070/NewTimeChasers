"use strict"

function makeSeal(){
	var seal;
	return seal = {

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
		// * for now just draw a tiny red circle that will
		// * be a place holder for the seal
		// * PLANNED
		// * import graphics for the seal and place it 
		// * in the appropriate position
		draw: function(_ctx){
			var ctx = _ctx;
			ctx.save();
			ctx.fillStyle = "blue";
			ctx.beginPath();
			// temporary drawing of a red circle to represent the seal
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
			this.posY =  Math.random() *(canvas.height - 10) + 10;

			return { score: 0, timer: 5};
		},

		// randomize
		// * move to a random location
		randomize: function(){
			this.posX = Math.random() *(canvas.width - 10) + 10;
			this.posY =  Math.random() *(canvas.height - 40) + 40;
		},

		// move
		// * move towards the ship
		move: function(shipX, shipY){
			return null;
		},

	}
}; 



