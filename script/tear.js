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
		top_speed: 3,
		// can't get top speed to work in this speed calculation
		speed : Math.random() *(5 - 0.1) + 0.1,

		// Static Variables
		MAX_SPEED : 3,
		MIN_SPEED : 0,
		DEFAULTX : canvas.width/2,
		DEFAULTY : canvas.height/2,
		TYPE : "tear",

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

			// Debug line for direction
			ctx.save();
			ctx.strokeStyle = "white";
			ctx.beginPath();
			ctx.moveTo(this.posX, this.posY);
			ctx.lineTo(this.posX + (50 * Math.cos(this.rotation)),this.posY + (50 * Math.sin(this.rotation)));
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
			// end debug line

		},

		// collected
		// * randomize the location of collected thing
		// * return the score and time changes 
		collected: function(){

			this.posX = Math.random() *(canvas.width - 10) + 10;
			this.posY =  Math.random() *(canvas.height - 10) + 10;
			
			return { score: 0, timer: -3};
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

			this.calcVelocity(shipX, shipY);


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

		calcVelocity: function(shipX, shipY){

			// The velocity of each tear should pont it in the direction
			// of the ship's current location. And it should head towards it
			// at the set speed. 

			// get the x distance
			var a = shipX - this.posX;
			// get the y distance
			var o = shipY - this.posY;

			// pythagoreans thing to get actual distance
			var h = Math.sqrt( o*o + a*a);

			// convert o/h to radians so you can get the deg
			var sin = o/h;

			// sin = opposite/hypotenuse
			// asin of sin is the angle
			// asin returns in radians
			var deg = Math.asin(sin);
			// convert deg back to radians from degrees
		
			this.velocity.x = this.speed * Math.cos(deg);
			this.velocity.y = this.speed * Math.sin(deg);

			if (shipX < this.posX){
				this.velocity.x *= -1;
			}
			/*if (shipY < this.posY){
				this.velocity.y *= -1;	
			} */
			
		}

	}
}; 



