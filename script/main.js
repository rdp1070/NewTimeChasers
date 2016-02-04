(function(){
			// keep me syntactically in line
			"use strict";
			
			// Variables
			var canvas,ctx;
			var ship;
			var collectibles = [];
			var timer;
			var elapsed_time;
			var score;
			var num_collectibles = 5;
			var background_frame = 0;
			var backgroundMusic = 0;
			var sounds = ["invincible","gem","tear","seal"];

			// Maximum number of collectible.
			var max_gems = 0;
			var max_blue_gems = 0;
			var max_tears = 0;
			var max_seals = 1;
			var max_pink_gems = 1;

			// gameState should have 4 settings
			// title: for the title screen
			// play: for the main game
			// pause: for paused game
			// endScreen: for the endScreen screen
			var gameState;
			var loading = true;
			var muted = false;

			// Moving variables
			var pressLeft = false;
			var pressRight = false;
			var pressUp = false;
			var pressDown = false;

			// Static Variables
			var CANVAS_WIDTH = 640;
			var CANVAS_HEIGHT = 520;
			var START_TIME = 15;
			var START_SCORE = 0;
			var MIN_COLLECTIBLES = 3;
			var MAX_COLLECTIBLES = 19;
			
			// Static Score Thresholds
			var SCORE_THRESHOLDS = {
				one : 1500,
				two : 3000,
				three : 4500,
				four : 9000,
			}
			

			// Static Time Thresholds
			var TIME_THRESHOLDS = {
				one : 45,
				two : 60,
				three : 120,
				four : 180
			}

			var images = ["title", "orb", "redOrb", "blue", "green", "pink", "ship", "backgroundImage"];

			// preload
			// * load all of the images and the sound ahead of time
			// * this prevent ugly popping when going back to the main screen.
			window.onload = function preload(){
				images["title"] = new Image();
				images["title"].src = "media/title.png";

				images["orb"] = new Image();
				images["orb"].src = "media/orb.png";

				// draw the red orb
				images["redOrb"] = new Image();
				images["redOrb"].src = "media/redOrb.png";

				images["blue"] = new Image();
				images["blue"].src = "media/blueGem.png";

				images["green"] = new Image();
				images["green"].src = "media/greenGem.png";

				images["pink"] = new Image();
				images["pink"].src = "media/pinkGem.png";	

				images["ship"] = new Image();
				images["ship"].src = "media/ship.png";			

				images["backgroundImage"] = new Image();
				images["backgroundImage"].src = "media/space.png";

				backgroundMusic = document.createElement("audio");
				//var sounds = ["invincible","gem","tear","seal"];
				sounds["gem"] = document.createElement("audio");
				sounds["tear"] = document.createElement("audio");
				sounds["seal"] = document.createElement("audio");
				sounds["invincible"] = document.createElement("audio");

				if (backgroundMusic.canPlayType("audio/mpeg")){
					backgroundMusic.setAttribute("src", "media/timeChasers.mp3");
					sounds["gem"].setAttribute("src", "media/gemSound.ogg");
					sounds["tear"].setAttribute("src", "media/tearSound.ogg");
					sounds["seal"].setAttribute("src", "media/sealSound.ogg");
					sounds["invincible"].setAttribute("src", "media/invincibleSound.ogg");
				} else {
					backgroundMusic.setAttribute("src", "media/timeChasers.ogg");
					sounds["gem"].setAttribute("src", "media/gemSound.ogg");
					sounds["tear"].setAttribute("src", "media/tearSound.ogg");
					sounds["seal"].setAttribute("src", "media/sealSound.ogg");
					sounds["invincible"].setAttribute("src", "media/invincibleSound.ogg");
				}
    			document.body.appendChild(backgroundMusic);
    			backgroundMusic.autoplay = true;
    			backgroundMusic.loop = true;
    			backgroundMusic.volume = 0.2;
    			sounds["gem"].volume = 0.5;
				sounds["tear"].volume = 0.9;
				sounds["seal"].volume = 0.5;
				sounds["invincible"].volume = 1;

    			loading = false;
				init();
			}

			// init
			// * called when the page loads to set up stuff
			function init(){
				// get the canvas from the document
				// get the context for the canvas
				canvas = document.querySelector("#canvas");
				ctx = canvas.getContext('2d');

				//image smoothing
				ctx.mozImageSmoothingEnabled = true;
				ctx.msImageSmoothingEnabled = true;
				ctx.imageSmoothingEnabled = true;

				// use event listeners attached to the window to call the 
				// onkeydown function
				window.addEventListener("keydown", onkeydown);
				window.addEventListener("keyup", onkeyup);

				// create the stuff needed for the game
				// ship, collectibles
				ship = makeShip();
				ship.preload();

				// set gameState
				gameState = "title";

				// set the canvas height and width
				canvas.height = CANVAS_HEIGHT;
				canvas.width = CANVAS_WIDTH;

				// set the start values
				timer = START_TIME;
				elapsed_time = 0;
				score = START_SCORE;


				// star the update loop
				update();
			}

			// onkeydown
			// parameters: e
			// * activates when a key is pressed down.
			function onkeydown(e){
				//console.log("keydown");
				// use keycodes from the events to 
				
				// this is the events for the arrows
				if (e.which == '37'){pressLeft = true; e.preventDefault();}
				if (e.which == '39'){pressRight = true; e.preventDefault();}
				if (e.which == '38'){pressUp = true; e.preventDefault();}
				if (e.which == '40'){pressDown = true; e.preventDefault();};
				
				// this is for "wasd"
				if (e.which == '65'){ pressLeft = true}
				if (e.which == '68'){ pressRight = true}
				if (e.which == '87'){ pressUp = true}
				if (e.which == '83'){ pressDown = true};

				// this is for the space bar
				// I use it as a cheat button 
				if (e.which == '32'){
					if (gameState == "title" ){
						gameState = "play";
						score = START_SCORE;
						e.preventDefault();
					} else if (gameState == "endScreen"){
						gameState = "title";
						e.preventDefault();
					} else {
						e.preventDefault();
					}
				}//  end SPACE if statement
			}


			// onkeyup
			// parameters: e
			// * activates when a key is released.
			function onkeyup(e){
				//console.log("key up");
				// this is the events for the arrows
				if (e.which == '37'){pressLeft = false;}
				if (e.which == '39'){pressRight = false;}
				if (e.which == '38'){pressUp = false;}
				if (e.which == '40'){pressDown = false;}
				
				// this is for "wasd"
				if (e.which == '65'){ pressLeft = false}
				if (e.which == '68'){ pressRight = false}
				if (e.which == '87'){ pressUp = false}
				if (e.which == '83'){ pressDown = false}

				// only pause the game if it is playing!
				// this is for P
				if(e.which == '80'){
					if (gameState == "play"){
						gameState = "pause";
					} else if (gameState == "pause"){
						gameState = "play";
					}
					
				} // end P if statement

				// only mute the music if it is playing!
				// this is for M
				if(e.which == '77'){
					mute();
				} // end M if statement
			}

			function checkCollision(){
				for (var i = 0; i< collectibles.length; i++){
					if (collectibles[i].TYPE == "tear" && ship.invincible == true){
						//do nothing!
					} else {
						// complicated collision checking nonsense.
						// get the x distance
						var a = ship.posX - collectibles[i].posX;
						// get the y distance
						var b = ship.posY - collectibles[i].posY;

						// pythagoreans thing to get actual distance
						var c = Math.sqrt( a*a + b*b);
						// combined value of both radii
						var radii = (ship.size + collectibles[i].size);

						// if distance is less than both radii then they hit!
						if (c < radii){
							// get collected nerd!
							var newValues = collectibles[i].collected();
							playSound(collectibles[i].TYPE);
							// the new values are returned by the collected function
							score += newValues.score;
							timer += newValues.timer;
							// if the collectible wants to delete, delete it.
							if (newValues.delete){
								// if the gem was pink, activate invincibility in the ship!
								if ( collectibles[i].TYPE == "pinkGem"){
									ship.invincible = true;
									ship.invincibility_timer = 5;
								}

								if (newValues.delete() == true){
									var temp = collectibles[i];
									collectibles[i] = collectibles[collectibles.length-1];
									collectibles[collectibles.length -1] = temp;
									collectibles.pop(); 
								}
							} // end delete check
						} // end radii check
					} // end else
				}	
			}// end checkCollision()

			// gameEnd
			// * do all the things for when the game is over
			function gameEnd(){

				gameState = "endScreen"
				timer = START_TIME;
				elapsed_time = 0;
				ship = makeShip();
				ship.preload();
				
				for (var x= collectibles.length; x > 0; x--){
					collectibles.pop();
				}
				collectibles = [];
			}

			// drawUI
			// * draw the score and time remaining.
			// * gets called every animation frame
			function drawUI(){
				if (loading == true){
					ctx.save();
					ctx.fontStyle = "black";
					ctx.textAlign = "center";
					ctx.font = "50px TEXWORK";
					ctx.fillText("LOADING...", CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
				}
				// if the game is on the title screen draw this
				else if (gameState == "title"){
					// save current draw settings
					ctx.save();
					ctx.fillStyle = "white";

					// actually draw the text
					ctx.drawImage(images["title"], 20, 0, 600, 300);

					// draw the blue orb
					// img, subx, suby, subWidth, subHeight, dx, dy, dHeigh, dWidth
					ctx.drawImage(images["orb"], 0, 0, 30, 30, 220, 320, 30, 30);
					ctx.font = "20px TEXWORK";
					ctx.fillText("+5 sec", 260, 340);

					
					// img, subx, suby, subWidth, subHeight, dx, dy, dHeigh, dWidth
					ctx.drawImage(images["redOrb"], 0, 0, 30, 30, 370, 320, 30, 30);
					ctx.font = "20px TEXWORK";
					ctx.fillText("-3 sec", 410, 340 );

					// draw the blue gem
					// img, subx, suby, subWidth, subHeight, dx, dy, dWidth, dHeight
					ctx.drawImage(images["blue"], 0, 0, 30, 30, 170, 360, 30, 30);
					ctx.font = "20px TEXWORK";
					ctx.fillText("+2 sec", 220, 380);
					ctx.fillText("50 pts", 220, 400);

					// draw the green gem
					// img, subx, suby, subWidth, subHeight, dx, dy, dWidth, dHeight
					ctx.drawImage(images["green"], 0, 0, 30, 30, 320, 360, 30, 30);
					ctx.font = "20px TEXWORK";
					ctx.fillText("100 pts", 365, 380 );

					// draw the pink gem
					// img, subx, suby, subWidth, subHeight, dx, dy, dWidth, dHeight
					ctx.drawImage(images["pink"], 0, 0, 21, 29, 470, 360,  21, 29);
					ctx.font = "20px TEXWORK";
					ctx.fillText("Invincibility", 500, 380 );

					// draw the ship
					// img, subx, suby, subWidth, subHeight, dx, dy, dWidth, dHeight
					ctx.drawImage(images["ship"], 100, 0, 50, 40, 80, 335, 50, 40);

					// Set the font
					ctx.font = "20px TEXWORK";
					ctx.fillText("Instructions:", 50, CANVAS_HEIGHT/2);

					ctx.font = "15px TEXWORK";
					ctx.fillText("Up or W speed up, Down or S slow down", 50, CANVAS_HEIGHT/2 + 15);
					ctx.fillText("Left or A turns left, Right or D turns right", 50, CANVAS_HEIGHT/2 + 30);
					ctx.fillText("M to Mute, P to Pause", 50, CANVAS_HEIGHT/2 + 45);
					

					ctx.font = "18px TEXWORK";
					ctx.fillText("Press SPACE to start", CANVAS_WIDTH/2 - 100, CANVAS_HEIGHT - 70);

					ctx.font = "14px TEXWORK";
					ctx.fillText("Code by Bobby Pruden", 10, CANVAS_HEIGHT - 30);
					ctx.fillText("Art by Tiffany McFarlane", 10, CANVAS_HEIGHT - 10);
					ctx.font = "16px TEXWORK";
					ctx.fillText("Music by Demigod q", CANVAS_WIDTH/2 + 110, CANVAS_HEIGHT - 10);

					//restore the draw settings
					ctx.restore();
				}

				// if the game is currently "play"ing draw this
				else if (gameState == "play"){
					// save current draw settings
					ctx.save();
					// set the font
					ctx.font = "20px TEXWORK";
					ctx.fillStyle = "white";

					// actually draw the text
					ctx.fillText("Score: " + score, 170, 30);
					ctx.fillText("Time: " + timer.toFixed(2), 30, 30);
					//ctx.fillText("Elapsed Time: " + Math.ceil(elapsed_time), 300, 30);


					//restore the draw settings
					ctx.restore();
				} 

				// if you are on the endScreen screen draw this
				else if (gameState == "endScreen") {
					// save current draw settings
					ctx.save();
					// set the font
					ctx.textAlign = "center";
					ctx.font = "50px TEXWORK";
					ctx.fillStyle = "white";

					// ctx.save();
					// ctx.strokeStyle = "white";
					// ctx.beginPath();
					// ctx.moveTo(CANVAS_WIDTH/2,0);
					// ctx.lineTo(CANVAS_WIDTH/2, CANVAS_HEIGHT);
					// ctx.stroke();
					// ctx.restore();

					// actually draw the text
					ctx.fillText("Time is Up!", (CANVAS_WIDTH/2), 200);
					ctx.fillText("Score: " + score, (CANVAS_WIDTH/2), 250);

					ctx.font = "20px TEXWORK";
					ctx.fillText("Press SPACE to return to menu", (CANVAS_WIDTH/2), CANVAS_HEIGHT - 100);

					//restore the draw settings
					ctx.restore();
				}

				// if paused draw this 
				else if (gameState == "pause") {

					// save current draw settings
					ctx.save();
					
					// set the font
					ctx.font = "20px TEXWORK";
					ctx.fillStyle = "white";

					// actually draw the text
					ctx.fillText("Score: " + score, 170, 30);
					ctx.fillText("Time: " + Math.ceil(timer), 30, 30);

					ctx.save();
					ctx.globalAlpha = 0.2;
					ctx.fillRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT,1);
					ctx.restore();

					ctx.textAlign = "center";
					// set the font
					ctx.font = "50px TEXWORK";
					ctx.fillStyle = "white";

					// actually draw the text
					ctx.fillText(">> PAUSE <<", CANVAS_WIDTH/2, CANVAS_HEIGHT/2);

					ctx.font = "20px TEXWORK"
					ctx.fillText("Press P to resume", CANVAS_WIDTH/2, CANVAS_HEIGHT - 100);

					//restore the draw settings
					ctx.restore();

				}
			}

			// Update
			// * calls the request animation frame
			// * causing the things within to repeat every 1/60th of a second
			function update(){

				// this schedules a call to the update() method in 1/60 seconds
				requestAnimationFrame(update);

				// draw the image, subtracting the size of the image
				// using the background_frames here I am able to animate the sprite. 
				ctx.drawImage(images["backgroundImage"], 640 * Math.floor(background_frame) , 0, 640, 520, 0, 0,  640, 520);


				// if the timer runs out, go to the endScreen screen
				if (timer <= 0) {
					gameEnd();
				};

				if ( ship.invincible == false ){
					sounds["invincible"].pause();
					sounds["invincible"].loop = false;
				}


				// if the end of the song 
				if (backgroundMusic.currentTime >= 61){
					backgroundMusic.currentTime = 0;
				}


				// if the gamestate is the title screen
				if( gameState == "play"){
					
					// handle the ship moving
					if (pressDown == true){
						ship.moveDown();
					}
					if (pressUp == true){
						ship.moveUp();
					} else {
						ship.slowDown();
					}
					if (pressLeft == true){
						ship.moveLeft();
					}
					if (pressRight == true){
						ship.moveRight();
					}

					//move the ship, then draw it
					ship.move();
					ship.drawShip(ctx);

					// Check the score, and create more obstacles as it gets higher. 
					// If the time/10 is a higher number, use that number for collectibles instead.
					if (num_collectibles <= MAX_COLLECTIBLES){ 
						num_collectibles = Math.max((score/250 + 4) , (elapsed_time/10 + 4) );
					}
					if (num_collectibles > MAX_COLLECTIBLES){
						num_collectibles = MAX_COLLECTIBLES;
					}

					// set the maximum number per collectible
					// max_type = Math.floor(score/(number required to add one more))+ minimum;
					max_gems = Math.min(Math.floor(score/1000) +3, 5);
					max_blue_gems = 1;
					max_tears = Math.min((Math.floor(score/250) +1) , 7);
					max_pink_gems = Math.min((Math.floor(score/500)) , 1);

					// check if the array of collectibles has the correct amount of collectibles in it.
					if (collectibles.length < Math.floor(num_collectibles)){
						
						// create the counting variables
						var num_gems = 0;
						var num_blue_gems = 0;
						var num_tears = 0;
						var num_seals = 0;
						var num_pink_gems = 0;

						// go through all of the collectibles and count them based on type
						for (var i = 0; i < collectibles.length; i++){

							if (collectibles[i].TYPE == "gem"){
								num_gems++;
							} else if (collectibles[i].TYPE == "blueGem"){
								num_blue_gems++;
							} else if (collectibles[i].TYPE == "tear"){
								num_tears++;
							} else if (collectibles[i].TYPE == "pinkGem"){
								num_pink_gems++;
							} else if (collectibles[i].TYPE == "seal"){
								num_seals++;
							}
						}

						// if the number of a thing is less than the max, generate one

						// make the gems
						if ( num_gems < max_gems){
							//console.log("num gems: "+ num_gems +", max gems: " + max_gems );
							// give it a one in 5 chance to be a blue gem when it's made.
							var randNum = Math.floor(Math.random() *5 + 1);
							var newGem;
							if (randNum == 4 && num_blue_gems < max_blue_gems){
								newGem = makeBlueGem();
								newGem.setImage(images["blue"]);
							} else if ( randNum * 2 == 8 && num_pink_gems < max_pink_gems && score > SCORE_THRESHOLDS.two) {
								newGem = makePinkGem();
								newGem.setImage(images["pink"]);
							} else {
								newGem = makeGem();
								newGem.setImage(images["green"]);
							}
							
							collectibles.push(newGem);
						} 
						// make the tears
						if (num_tears < max_tears){
							var newTear = makeTear();
							newTear.setImage(images["redOrb"]);
							collectibles.push(newTear);
						} 
						// make the seals
						if (num_seals < max_seals){
							var newSeal = makeSeal();
							newSeal.setImage(images["orb"]);
							collectibles.push(newSeal);
						}
					}
					

					// Calculate the time, then draw the UI
					timer -= (1/60);
					elapsed_time += (1/60);
					// count down the invincibility timer.
					if (ship.invincible == true){
						ship.invincibility_timer -= (1/60);
					}
					if (ship.invincibility_timer <= 0){
						ship.invincible = false;
					}


					
					// Do different behaviors if the score is over certain 
					// thresholds, refered to as "SCORE_THRESHOLD"s
					for (var i=0; i< collectibles.length; i++){
						if ( score > SCORE_THRESHOLDS.three || elapsed_time > TIME_THRESHOLDS.three){
							collectibles[i].move(ship.posX, ship.posY);
							// this moves the tears twice as fast. 
							if (collectibles[i].TYPE == "tear"){
								collectibles[i].move(ship.posX, ship.posY);
							}

						}
						else if ( score >= SCORE_THRESHOLDS.two || timer > 80 || elapsed_time > TIME_THRESHOLDS.two){
							if (collectibles[i].TYPE == "seal" || collectibles[i].TYPE == "tear" || collectibles[i].TYPE == "pinkGem"){
								collectibles[i].move(ship.posX, ship.posY);
							}
						}
						else if ( score >= SCORE_THRESHOLDS.one || timer > 60 || elapsed_time > TIME_THRESHOLDS.one){
							if (collectibles[i].TYPE == "seal"){
								collectibles[i].move(ship.posX, ship.posY);
							}
						} 
						collectibles[i].draw(ctx);
					}



					// Draw the UI 
					drawUI();
					

					window.onblur = function(){
						if (gameState == "play"){
							gameState = "pause";
						}
					} 

					checkCollision();

				} else if (gameState == "title") {

					// draw the title UI
					drawUI();

				} else if (gameState == "endScreen"){
					
					ship = makeShip();
					ship.preload();
					drawUI();

				} else if (gameState == "pause"){

					ship.drawShip(ctx);
					drawUI();

				} // end if chain


				// this sets the background_frame speed. 
				if ( background_frame < 2){
					background_frame += 1/15;
				}
				else{
					background_frame = 0;
				}	

			}

			// PlaySound
			// * play sound effect for appropriate item 
			function playSound(tag){
				if (tag == "blueGem"){
					sounds["gem"].play();
				} else if(tag == "pinkGem"){
					sounds["invincible"].play();
					sounds["invincible"].loop = true;
				} else {
					sounds[tag].play();
				}
			}

			// Mute
			// * mute all the things
			function mute(){
				if (muted){
					backgroundMusic.volume = 0;
					sounds["gem"].volume = 0;
					sounds["tear"].volume = 0;
					sounds["seal"].volume = 0;
					sounds["invincible"].volume = 0;
					muted = !muted;
				} else {
					backgroundMusic.volume = 0.2;
					sounds["gem"].volume = 0.5;
					sounds["tear"].volume = 0.9;
					sounds["seal"].volume = 0.5;
					sounds["invincible"].volume = 1;
					muted = !muted;
				}
			}


		}());