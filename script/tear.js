"use strict"

function makeTear(){
	var tear;
	return tear = {

		// Variables
		posX: Math.random() *(canvas.width - 10) + 10,
		posY :  Math.random() *(canvas.height - 10) + 10,
		size : 15,
		velocity : {
			x: 0,
			y: 0,
		},
		rotation: 0,
		speed : Math.random() *(5) - 3,

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
			this.setImage();

			if (!this.img){
				ctx.save();
				ctx.fillStyle = "red";
				ctx.beginPath();
				// temporary drawing of a blue circle to represent the seal
				ctx.arc(this.posX,this.posY,this.size,0,2*Math.PI);
				ctx.fill();
				ctx.closePath();
				ctx.restore();
			} 
			else {				
				
			
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
					this.frame += 1/3;
				else
					this.frame = 0;

				// ctx.save();
				// ctx.fillStyle = "red";
				// ctx.beginPath();
				// // temporary drawing of a blue circle to represent the seal
				// ctx.arc(this.posX,this.posY,this.size,0,2*Math.PI);
				// ctx.fill();
				// ctx.closePath();
				// ctx.restore();

			}

		},

		// collected
		// * randomize the location of collected thing
		// * return the score and time changes 
		collected: function(){

			this.randomize();
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

		// setImage()
		// * set the image of the gem to the appropriate img
		// * so when you draw it in the draw function 
		// * it's the right one
		setImage: function(){
			this.img = new Image();
			this.img.onload = function(){
				//blah
			}

			this.img.src = "media/RedOrb.png";
		},

		calcVelocity: function(shipX, shipY){

			// Go in a straight line left or right 

			this.velocity.x = this.speed;

			
		}

	}
}; 



