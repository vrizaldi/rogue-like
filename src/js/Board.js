import React from "react";

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 100;

const MAX_ROOM_NUM = 20;

const RENDER_SCALE = 25;

const CAM_WIDTH = 21;
const CAM_HEIGHT = 21;

export default class Board extends React.Component {

	constructor() {
		super();

		this.state = {
			player: {
				hp: 0,
				atk: 0,
				lvl: 0,
				exp: 0,
				weapon: "",
				x: 0,
				y: 0
			},
			camX: 0,
			camY: 0,
			paths: [],
			canStart: false
		};
	}

	componentWillMount() {

		// update every time player make a move
		document.addEventListener("keydown", (e) => {
			console.log(e);
			e.preventDefault();
			switch(e.key) {
			case "ArrowUp":
				this.movePlayer(0, -1);
				break;
			case "ArrowDown":
				this.movePlayer(0, 1);
				break;
			case "ArrowRight":
				this.movePlayer(1, 0);
				break;
			case "ArrowLeft":
				this.movePlayer(-1, 0);
				break;
			}
		});

	}

	movePlayer(x, y) {
		var { player, camX, camY } = this.state;
		player.x += x;
		player.y += y;
		
		// update cam
		// centre player
		
		camX = player.x - Math.floor(CAM_WIDTH / 2);
		camY = player.y - Math.floor(CAM_WIDTH / 2);

		this.setState({player, camX, camY});
			// update states
		this.updateGame();
			// update to the next tick
	}


	componentWillUnmount() {
		document.removeEventHandler("keydown");
	}

	newGame() {

		this.setState({
				player: {
				hp: 100,
				atk: 7,
				lvl: 1,
				exp: 0,
				weapon: "stick",
				x: 0,
				y: 0
			},
			camX: -Math.floor(CAM_WIDTH / 2),
			camY: -Math.floor(CAM_HEIGHT / 2),
			paths: this.createPaths(),
			canStart: true
		});
	}

	createPaths() {
		// create paths available for player

		var paths = [];
		for(var x = 0; x < WORLD_WIDTH; x++) {
			paths[x] = [];
			for(var y = 0; y < WORLD_HEIGHT; y++) {
				paths[x][y] = false;
			}
		}
		this.createRoom(0, paths, 0, 0);
		return paths;
	}

	createRoom(count, paths, x, y) {
		if(count > MAX_ROOM_NUM) return;

		// use recursion to make rooms to paths
		var width = Math.ceil(Math.random() * 9 + 1);
		var height = Math.ceil(Math.random() * 9 + 1);
			// length could be 1 - 10

		// render the room to paths
		for(var offX = 0; offX < width; offX++) {
			if(x + offX >= WORLD_WIDTH) break;
				// the edge of the world
			
			for(var offY = 0; offY < height; offY++) {
				if(y + offY >= WORLD_HEIGHT) break;

				paths[x + offX][y + offY] = true;
			}
		}

		// create the next room
		var east = Math.random() < 0.5 ? true : false;
		if(east && x < WORLD_WIDTH - 1) {
			// create next room in the east
			this.createRoom(++count, paths, x + width, y);
		} else if(!east && y < WORLD_HEIGHT - 1) {
			// create next room in the north
			this.createRoom(++count, paths, x, y + height);
		}
	}

	updateGame() {
		this.renderGame();
	}

	renderGame() {
		// render the current game state

		var canvas = document.getElementById("game");
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
			// clear canvas
		
		var { camX, camY, paths, player } = this.state;
		console.log("player x:", player.x);
		console.log("player y:", player.y);
		console.log("cam x:", camX);
		console.log("cam y:", camY);

		console.log(paths);
		for(var offX = 0; offX < CAM_WIDTH; offX++) {
			for(var offY = 0; offY < CAM_HEIGHT; offY++) {
				var x = camX + offX;
				var y = camY + offY;
//				console.log("Coordinate: (" + x + ", " + y + ")");
				if(x > WORLD_WIDTH
						|| x < 0
						|| y > WORLD_HEIGHT
						|| y < 0
						|| !paths[x][y]) {
					// fill in with black
					// if cam outside the world
					// or if there's no path
					ctx.fillStyle = "#000000";

				} else if(x == player.x
						&& y == player.y) {
					// draw player green
					ctx.fillStyle = "#00ff00";

				}	else if(paths[x][y]) {
					// draw paths yellow
					ctx.fillStyle = "#d2ef11";
				} 
				ctx.fillRect(offX * RENDER_SCALE, 
						offY * RENDER_SCALE, 
						RENDER_SCALE, 
						RENDER_SCALE);
			}	// for
		}	// for

	}

	initGame() {
		this.setState({canStart: false});
		this.updateGame();
	}

	render() {
		return(
			<div>
				<button onClick={this.newGame.bind(this)}>New Game</button>
				{this.state.canStart ? 
						(<button 
								onClick={this.initGame.bind(this)}>
							Start
						</button>)
						: ("")}
				<canvas id="game" width="500" height="500"/>
			</div>
		);
	}
}
