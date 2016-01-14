"use strict"

function makeSeal(){
	var seal;
	return seal = {

		// Variables
		posX: Math.random() *(canvas.width - 100) + 100,
		posY :  Math.random() *(canvas.height - 100) + 100,
		size : 15,
		velocity : {
			x: 0,
			y: 0,
		},
		rotation: 0,
		frame: 0,
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
			this.setImage();
			
			if (!this.img){
				ctx.save();
				ctx.fillStyle = "blue";
				ctx.beginPath();
				// temporary drawing of a blue circle to represent the seal
				ctx.arc(this.posX,this.posY,this.size,0,2*Math.PI);
				ctx.fill();
				ctx.closePath();
				ctx.restore();


			} 
			else {				
				
				// ctx.save();
				// ctx.fillStyle = "blue";
				// ctx.beginPath();
				// // temporary drawing of a blue circle to represent the seal
				// ctx.arc(this.posX,this.posY,this.size,0,2*Math.PI);
				// ctx.fill();
				// ctx.closePath();
				// ctx.restore();

				ctx.save();
				// translate it to the pivot point
				ctx.translate( this.posX, this.posY);
				// tell it how to rotate and where to rotate
				ctx.rotate(this.rotation);
				// draw the image, subtracting the size of the image
				// using the frames here I am able to animate the sprite. 
				ctx.drawImage(this.img, 30 * Math.floor(this.frame) , 0, 30, 30, -this.size, -this.size,  30, 30);

				ctx.restore();
				
				// this sets the frame speed. 
				if ( this.frame < 9)
					this.frame += 1/5;
				else
					this.frame = 0;
			}
			
		},

		// setImage()
		// * set the image of the gem to the appropriate img
		// * so when you draw it in the draw function 
		// * it's the right one
		setImage: function(){
			this.img = new Image();
			this.img.onload = function(){
				//blah
			}

			this.img.src = "media/orb.png";
		},


		// collected
		// * randomize the location of collected thing
		// * return the score and time changes 
		collected: function(){
			this.randomize();
			return { score: 0, timer: 5};
		},

		// randomize
		// * move to a random location
		randomize: function(){
			this.posX = Math.floor(Math.random() *(canvas.width - 100) + 100);
			this.posY =  Math.floor(Math.random() *(canvas.height - 100) + 100);
		},

		// move
		// * move away from the ship
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
			// The velocity of each tear should point in the direction
			// opposite of the ship's current location. And it should head towards it
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
			//this.rotation += 2;
		
			if ( h < this.chase_range){

				// this calculates the x velocity of the seal
				// make sure the speed is inversed, otherwise it will
				// head directly at it.
				this.velocity.x = -this.speed * Math.cos(this.rotation );
				// this calculates the y velocity of the seal
				// make sure the speed is inversed, otherwise it will
				// head directly at it.
				this.velocity.y = -this.speed * Math.sin(this.rotation );

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



