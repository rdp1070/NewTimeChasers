"use strict"

function makeTear(){
	var tear;
	return tear = {

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

		// Static Variables
		MAX_SPEED : 5,
		MIN_SPEED : 0,
		DEFAULTX : canvas.width/2,
		DEFAULTY : canvas.height/2,

		// drawShip
		// * for now just draw a tiny red circle that will
		// * be a place holder for the tear
		// * PLANNED
		// * import graphics for the tear and place it 
		// * in the appropriate position
		draw: function(_ctx){
			var ctx = _ctx;
			ctx.save();
			ctx.fillStyle = "red";
			ctx.beginPath();
			// temporary drawing of a red circle to represent the tear
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

			return { score: 0, timer: -3};
		},

		// move
		// * move towards the ship
		move: function(shipX, shipY){
			this.posX -= shipX;
			this.posY -= shipY;
		},

	}
}; 



