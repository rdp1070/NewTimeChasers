"use strict"

function makeShip(){
	var ship;
	return ship = {

		// Variables
		posX: canvas.width/2,
		posY : canvas.height/2,
		size: 20,
		velocity : {
			x: 0,
			y: 0,
		},
		rotation: 0,
		speed : 3,
		friction : .97,
		invincible : false,
		invincibility_timer: 0,
		// so you can preload the images
		normShip : new Image,
		pinkShip: new Image,
		flashShip: new Image,

		// Static Variables
		MAX_SPEED : 6,
		MIN_SPEED : 1,
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
			if (this.speed < this.MAX_SPEED){
				if (this.speed < this.MAX_SPEED/2){
					this.speed+= .5;
				}
				else {
					this.speed += .1;
				}
			}
		},
		// moveDown
		//* decelerate
		moveDown: function(){
			if (this.speed > this.MIN_SPEED){
				if (this.speed > this.MAX_SPEED/2){
					this.speed-= .5;
				}
				else {
					this.speed -= .1;
				}
			}
		},

		// slowDown
		//* decelerate naturally
		slowDown: function(){
			if (this.speed > this.MIN_SPEED){
				this.speed *= this.friction;
			}
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
			this.setImage();

			if (!this.img){
				ctx.save();
				ctx.fillStyle = "white";
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
				ctx.drawImage(this.img, 50 * Math.floor(this.frame) , 0, 50, 40, -this.size, -this.size,  50, 40);

				ctx.restore();
				
				// this sets the frame speed. 
				if ( this.frame < 3)
					this.frame += 1/ 10;
				else
					this.frame = 0;

				// ctx.save();
				// ctx.fillStyle = "white";
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
		setImage: function(){
			this.img = new Image();
			this.img.onload = function(){
				//blah
			}
			if (this.invincible == true ){
				if(this.invincibility_timer < 2 && this.invincibility_timer > 0) {
					this.img = this.flashShip;
				} else {
					this.img = this.pinkShip;
				}
			} else {
				this.img = this.normShip;
			}
		},

		// preload 
		// * preload all of the images so you don't have to load them later. 
		preload: function(){
			this.normShip.src = "media/ship.png";
			this.flashShip.src = "media/shipFlash.png";
			this.pinkShip.src = "media/pinkship.png";
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
