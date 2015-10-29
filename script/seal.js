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
		speed : 1.5,
		top_speed : 5,
		chase_range : 200 ,

		// Static Variables
		MAX_SPEED : 5,
		MIN_SPEED : 0,
		DEFAULTX : canvas.width/2,
		DEFAULTY : canvas.height/2,
		TYPE : "seal",

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
			
			this.calcVelocity(shipX, shipY);
			// if the position exceeds height of screen
			// warp the ship to the other side
			// otherwise just add the y velocity
			if(this.posY > canvas.height){
				this.randomize();
			} else if(this.posY < 0){
				this.randomize();
			} else {
				this.posY += this.velocity.y;
			}
			

			// if the position exceeds width of screen
			// warp the ship to the other side
			// otherwise just add the x velocity
			if (this.posX > canvas.width){
				this.randomize();
			} else if( this.posX < 0){
				this.randomize();
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
			this.rotation = Math.asin(sin);
			//console.log("seal rotation:" + this.rotation);
			this.rotation += 180;
			// convert deg back to radians from degrees
		
			if ( h < this.chase_range){
				this.velocity.x = this.speed * Math.cos(this.rotation );
				this.velocity.y = this.speed * Math.sin(this.rotation );
			} else {
				this.velocity.x = 0;
				this.velocity.y = 0;
			}
			if (shipX < this.posX){
				this.velocity.x *= -1;
			}

			
		},

	}
}; 



