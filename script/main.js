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

			// gameState should have 4 settings
			// title: for the title screen
			// play: for the main game
			// pause: for paused game
			// highscore: for the highscore screen
			var gameState;

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
			var MAX_COLLECTIBLES = 14;
			
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


			// init
			// * called when the page loads to set up stuff
			window.onload = function init(){
				// get the canvas from the document
				// get the context for the canvas
				canvas = document.querySelector("#canvas");
				ctx = canvas.getContext("2d");

				// use event listeners attached to the window to call the 
				// onkeydown function
				window.addEventListener("keydown", onkeydown);
				window.addEventListener("keyup", onkeyup);

				// create the stuff needed for the game
				// ship, collectibles
				ship = makeShip();

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
				if (e.which == '37'){pressLeft = true;}
				else if (e.which == '39'){pressRight = true;}
				else if (e.which == '38'){pressUp = true;}
				else if (e.which == '40'){pressDown = true;};
				
				// this is for "wasd"
				if (e.which == '65'){ pressLeft = true}
				else if (e.which == '68'){ pressRight = true}
				else if (e.which == '87'){ pressUp = true}
				else if (e.which == '83'){ pressDown = true};

				// this is for the space bar
				if (e.which == '32'){
					if (gameState == "title" || gameState == "highscore"){
						gameState = "play";
						score = START_SCORE;
					} else {
						// a cheat to add time for now
						score+= 100;
						//timer++;
					}
				}//  end SPACE if statement

				// only pause the game if it is playing!
				// this is for P
				if(e.which == '80'){
					if (gameState == "play"){
						gameState = "pause";
					} else if (gameState == "pause"){
						gameState = "play";
					}
					
				} // end P if statement
			}


			// onkeyup
			// parameters: e
			// * activates when a key is released.
			function onkeyup(e){
				//console.log("key up");
				// this is the events for the arrows
				if (e.which == '37'){pressLeft = false;}
				else if (e.which == '39'){pressRight = false;}
				else if (e.which == '38'){pressUp = false;}
				else if (e.which == '40'){pressDown = false;};
				
				// this is for "wasd"
				if (e.which == '65'){ pressLeft = false}
				else if (e.which == '68'){ pressRight = false}
				else if (e.which == '87'){ pressUp = false}
				else if (e.which == '83'){ pressDown = false};
			}

			function checkCollision(){
				for (var i = 0; i< collectibles.length; i++){
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
						// the new values are returned by the collected function
						score += newValues.score;
						timer += newValues.timer;
					}
				}	
			}

			// gameEnd
			// * do all the things for when the game is over
			function gameEnd(){
				
				/* Check to see if there is local storage for this browser
				if(typeof(Storage) !== "undefined") {
				    for (var x = 0; x < localStorage.NTC_highscores.length; x++){
				    	if (score > localStorage.NTC_highscores[x]){
				    		// THIS BREAKS HERE, IT NEEDS TO BE A STRING
				    		localStorage.NTC_highscores[x] = score;
				    		debugger;
				    		break;
				    	}
				    }
				    
				} else {
				    // Sorry! No Web Storage support..
				}*/

				gameState = "highscore"
				timer = START_TIME;
				elapsed_time = 0;
				
				for (var x= collectibles.length; x > 0; x--){
					collectibles.pop();
				}
				collectibles = [];
			}

			// drawUI
			// * draw the score and time remaining.
			// * gets called every animation frame
			function drawUI(){
				
				// if the game is on the title screen draw this
				if (gameState == "title"){
					// save current draw settings
					ctx.save();

					// set the font
					ctx.font = "50px Arial";
					ctx.fillStyle = "white";

					// actually draw the text
					ctx.fillText("TIME CHASERS", 50, CANVAS_HEIGHT/2);

					ctx.font = "20px Arial";
					ctx.fillText("Instructions:", 50, CANVAS_HEIGHT/2 + 50);

					ctx.font = "12px Arial";
					ctx.fillText("Up/A speed up, Down/S slow down", 50, CANVAS_HEIGHT/2 + 65);
					ctx.fillText("Left Right/A D turn left and right", 50, CANVAS_HEIGHT/2 + 80);
					ctx.fillText("BLUE orbs ADDS, RED SUBTRACTS, GREEN are POINTS", 50, CANVAS_HEIGHT/2 + 95);

					ctx.font = "20px Arial"
					ctx.fillText("Press SPACE to start", CANVAS_WIDTH/2 - 50, CANVAS_HEIGHT - 100);

					//restore the draw settings
					ctx.restore();
				}

				// if the game is currently "play"ing draw this
				else if (gameState == "play"){
					// save current draw settings
					ctx.save();
					// set the font
					ctx.font = "20px Arial";
					ctx.fillStyle = "white";

					// actually draw the text
					ctx.fillText("Score: " + score, 10, 30);
					ctx.fillText("Time: " + Math.ceil(timer), 150, 30);
					ctx.fillText("Elapsed Time: " + Math.ceil(elapsed_time), 300, 30);


					//restore the draw settings
					ctx.restore();
				} 

				// if you are on the highscore screen draw this
				else if (gameState == "highscore") {
					// save current draw settings
					ctx.save();
					// set the font
					ctx.font = "50px Arial";
					ctx.fillStyle = "white";

					// actually draw the text
					ctx.fillText("Time is Up!", CANVAS_WIDTH/2 - 100, 200);
					ctx.fillText("Score:" + score, CANVAS_WIDTH/2 - 100, 250);

					ctx.font = "20px Arial"
					ctx.fillText("Press SPACE to start", CANVAS_WIDTH/2, CANVAS_HEIGHT - 100);

					//restore the draw settings
					ctx.restore();
				}

				// if paused draw this 
				else if (gameState == "pause") {

					// save current draw settings
					ctx.save();

					// set the font
					ctx.font = "20px Arial";
					ctx.fillStyle = "white";

					// actually draw the text
					ctx.fillText("Score: " + score, 10, 30);
					ctx.fillText("Time: " + Math.ceil(timer), 150, 30);

					ctx.globalAlpha = 0.2;
					ctx.fillRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT,1);
					ctx.globalAlpha = 1;

					// set the font
					ctx.font = "50px Arial";
					ctx.fillStyle = "white";

					// actually draw the text
					ctx.fillText(">> PAUSE <<", 80, CANVAS_HEIGHT/2);

					ctx.font = "20px Arial"
					ctx.fillText("Press P to resume", CANVAS_WIDTH/2 - 50, CANVAS_HEIGHT - 100);

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

				// redraws the background, a page clear.
				ctx.fillRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT,1);

				// if the timer runs out, go to the highscore screen
				if (timer <= 0) {
					gameEnd();
				};


				// if the gamestate is the title screen
				if( gameState == "play"){
					
					// handle the ship moving
					if (pressDown == true){
						ship.moveDown();
					} else if (pressUp == true){
						ship.moveUp();
					} else if (pressLeft == true){
						ship.moveLeft();
					} else if (pressRight == true){
						ship.moveRight();
					}

					//move the ship, then draw it
					ship.move();
					ship.drawShip(ctx);

					// generate the collectibles
					if (collectibles.length < MIN_COLLECTIBLES){
						var newGem = makeGem();
						collectibles.push(newGem);
						var newSeal = makeSeal();
						collectibles.push(newSeal);
					}

					// check the score, and create more obstacles as it gets higher. If the time/20 is a higher number, use that number for collectibles instead.
					if (num_collectibles <= MAX_COLLECTIBLES){ 
						num_collectibles = Math.max((score/250 + 3) , (elapsed_time/10 + 3) );
					}
					if (num_collectibles > MAX_COLLECTIBLES){
						num_collectibles = MAX_COLLECTIBLES;
					}
					if (collectibles.length < Math.floor(num_collectibles)){
						if (score % 1000 == 0){
							var newGem = makeGem();
							collectibles.push(newGem);
						} 
						if (score % 250 == 0){
							var newTear = makeTear();
							collectibles.push(newTear);
						}
					}
					

					// Calculate the time, then draw the UI
					timer -= (1/60);
					elapsed_time += (1/60);
					
					// Do different behaviors if the score is over certain 
					// thresholds, refered to as "SCORE_THRESHOLD"s
					for (var i=0; i< collectibles.length; i++){
						
						if ( score > SCORE_THRESHOLDS.three || elapsed_time > TIME_THRESHOLDS.three){
							collectibles[i].move(ship.posX, ship.posY);
							if (collectibles[i].TYPE == "tear"){
								collectibles[i].move(ship.posX, ship.posY);
							}
						}
						else if ( score >= SCORE_THRESHOLDS.two || timer > 80 || elapsed_time > TIME_THRESHOLDS.two){
							if (collectibles[i].TYPE == "seal" || collectibles[i].TYPE == "tear" ){
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

				} else if (gameState == "highscore"){
					
					// ADD CODE TO SAVE THE HIGHSCORE HERE

					ship.shipReset();
					drawUI();

				} else if (gameState == "pause"){

					ship.shipPause();
					ship.drawShip(ctx);
					drawUI();

					
					
				} // end if chain
			}

		}());