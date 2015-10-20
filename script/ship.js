"use strict"

function makeShip(){
	var ship;
	return ship = {

		// Variables
		posX: canvas.width/2,
		posY : canvas.height/2,
		size: 15,
		velocity : {
			x: 0,
			y: 0,
		},
		rotation: 0,
		speed : 3,
		friction: .02,

		// Static Variables
		MAX_SPEED : 8,
		MIN_SPEED : 0,
		DEFAULTX : canvas.width/2,
		DEFAULTY : canvas.height/2,

		// moveLeft
		// * rotate to the left
		moveLeft: function(){
			this.rotation -= Math.PI/32;
		},
		// moveRight
		// * roate to the right
		moveRight: function(){
			this.rotation += Math.PI/32;
		},
		// moveUp
		// * accelerate
		moveUp: function(){
			if (this.speed < this.MAX_SPEED)   this.speed+= .5;
		},
		// moveDown
		//* decelerate
		moveDown: function(){
			if (this.speed > this.MIN_SPEED)   this.speed-= .5;
		},

		// move
		// * before you move calculate the velocity
		// * add the velocity to the position.
		move: function(){

			this.calcVelocity();

			// if the position exceeds height of screen
			// warp the ship to the other side
			// otherwise just add the y velocity
			if(this.posY > canvas.height){
				this.posY = 0;
			} else if(this.posY < 0){
				this.posY = canvas.height;
			} else {
				this.posY += this.velocity.y;
			}
			
			// if the position exceeds width of screen
			// warp the ship to the other side
			// otherwise just add the x velocity
			if (this.posX > canvas.width){
				this.posX = 0;
			} else if( this.posX < 0) {
				this.posX = canvas.width;
			} else {
				this.posX += this.velocity.x;
			}
		},

		// shipPause
		// * stops moving the ship
		shipPause: function(){
			this.velocity.x = 0;
			this.velocity.y = 0;
		},

		// shipReset
		// * reset the ships values to their defaults
		shipReset: function(){
			this.velocity.x = 0;
			this.velocity.y = 0;
			this.speed = 3;
			ship.posX = this.DEFAULTX;
			ship.posY = this.DEFAULTY;

		},

		// drawShip
		// * for now just draw a tiny circle that will
		// * be a place holder for the ship
		// * PLANNED
		// * import graphics for the ship and place it 
		// * in the appropriate position
		drawShip: function(_ctx){
			var ctx = _ctx;
			ctx.save();
			ctx.fillStyle = "blue";
			ctx.beginPath();
			ctx.arc(this.posX,this.posY,this.size,0,2*Math.PI);
			ctx.closePath();
			ctx.fill();
			ctx.restore();
		},



		// calcVelocity 
		// * calculates the x and y of the velocity
		// * The sin of the angle times the magnitude of the hypotenuse
		// * for the y value.
		// * The cos of the angle times the magnitude of the hypotenuse
		// * for the x value.
		calcVelocity: function(){
			//if (this.speed > this.MIN_SPEED);
			this.velocity.y = Math.sin(this.rotation) * this.speed;
			this.velocity.x = Math.cos(this.rotation) * this.speed;
		},
	}
}; 



