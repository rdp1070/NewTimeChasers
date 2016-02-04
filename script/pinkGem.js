"use strict"

function makePinkGem(){
	var gem;
	return gem = {

		// Variables
		posX: 0,
		posY :  Math.random() *(canvas.height - 10) + 10,
		size : 10,
		velocity : {
			x: 0,
			y: 0,
		},
		rotation: Math.random() *(-Math.PI/4) + Math.PI/4,
		rotation_speed: 0,
		speed : 1,
		top_speed : 0,
		img : 0,

		// Static Variables
		MAX_SPEED : 5,
		MIN_SPEED : 0,
		DEFAULTX : canvas.width/2,
		DEFAULTY : canvas.height/2,
		TYPE : "pinkGem",

		// drawShip
		// * for now just draw a tiny green square that will
		// * be a place holder for the gem
		// * PLANNED
		// * import graphics for the gem and place it 
		// * in the appropriate position
		draw: function(_ctx){
			var ctx = _ctx;
			
			if (!this.img){
				ctx.save();
				ctx.fillStyle = "pink";
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
				ctx.rotate(this.rotation + Math.PI/2);
				// draw the image, subtracting the size of the image
				ctx.drawImage(this.img, 21 * Math.floor(this.frame) , 0, 21, 29, -this.size, -this.size,  21, 29);
				ctx.restore();
				
				// this sets the frame speed. 
				if ( this.frame < 5)
					this.frame += 1/5;
				else
					this.frame = 0;

				// ctx.save();
				// ctx.fillStyle = "pink";
				// ctx.beginPath();
				// // temporary drawing of a blue circle to represent the seal
				// ctx.arc(this.posX,this.posY,this.size,0,2*Math.PI);
				// ctx.fill();
				// ctx.closePath();
				// ctx.restore();

				
			}
			
		},

		// setImage()
		// * set the image of the gem to the appropriate img
		// * so when you draw it in the draw function 
		// * it's the right one
		setImage: function(newImage){
			this.img = newImage;
		},

		// collected
		// * randomize the location of collected thing
		// * return the score and time changes 
		collected: function(){
			return { score: 0, timer: 0, delete: function(){ return true; } };
		},

		// randomize
		// * move to a random location
		randomize: function(){
			// this doesn't happen for pinkGems
		},

		// move
		// * move the gem somehow
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
			} else if( this.posX < 0){
				this.posX = canvas.width;
			} else {
				this.posX += this.velocity.x;
			}
		},

		calcVelocity: function(shipX, shipY){

			this.velocity.x = this.speed * Math.cos(this.rotation);
			this.velocity.y = this.speed * Math.sin(this.rotation);
		},

	}
}; 



