import React from "react";

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 100;

const MAX_ROOM_NUM = 20;

const RENDER_SCALE = 25;

const CAM_WIDTH = 15;
const CAM_HEIGHT = 21;

const WALL = 0;
const PATH = 1;
const ENEMY = 3;
const LOOT = 4;

export default class Board extends React.Component {

	constructor() {
		super();

		this.state = {
			player: {
				hp: 0,
				atk: 0,
				lvl: 0,
				exp: 0,
	//			weapon: "",
				x: 0,
				y: 0
			},
			camX: 0,
			camY: 0,
			paths: [],
			enemies: {},
			canStart: false,
			dead: false
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

		if(this.state.dead) return;
		console.log("dead:", this.state.dead);

		var { player, camX, camY, paths, boss, enemies } = this.state;
		var newPosX = player.x + x;
		var newPosY = player.y + y;
		if(newPosX < 0
				|| newPosX >= WORLD_WIDTH
				|| newPosY < 0
				|| newPosY >= WORLD_HEIGHT
				|| paths[newPosX][newPosY] == WALL) 
			// prevent illegal position
			return;

		else if(paths[newPosX][newPosY] == LOOT) {
			var rand = Math.random();

			if(rand < 0.5) {
				// hp item
				player.hp += 30;
				if(player.hp > 60) player.hp = 60;

			} else {
				// better weapon
				player.atk += 10;
				if(player.atk > 20) player.atk = 20;
			}
			paths[newPosX][newPosY] = PATH;

		} else if(paths[newPosX][newPosY] == ENEMY) {
			// an enemy	
			console.log(enemies);
			console.log("finding", "" + newPosX + "," + newPosY);
			var enemy = enemies["" + newPosX + "," + newPosY];
			enemy.hp -= player.atk;
			console.log("enemy hp: ",enemy.hp)
			player.hp -= Math.floor(Math.random() * 11);
				// take random damage
			this.setState({enemy});

			if(player.hp <= 0) {
				// lost the game
				player.hp = 0;

				// move enemy onto player
				// showing that they're dead
				paths[newPosX][newPosY] = PATH;
				paths[player.x][player.y] = ENEMY;
				player.x = -200;
				player.y = -200;
				
				this.setState({dead: true, player, paths});
				this.updateGame();
					// final render
				return;
			}
			
			if(enemy.hp > 0) {
				// enemy still alive
				return;
			} 		
			// otherwise get xp, change tile and move on
			paths[newPosX][newPosY] = PATH;
			player.exp += Math.round(Math.random()) + 1;
			console.log(player.exp);
			player.lvl = this.checkLevel(player);
		}

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

	checkLevel(player) {
		var { exp } = player;
		if(exp > 300) {
			return 10;
		} else if(exp > 250) {
			return 9;
		} else if(exp > 128) {
			return 8;
		} else if(exp > 64) {
			return 7;
		} else if(exp > 32) {
			return 6;
		} else if(exp > 16) {
			return 5;
		} else if(exp > 8) {
			return 4;
		} else if(exp > 4) {
			return 3;
		} else if(exp > 2) {
			return 2;
		} else {
			return 1;
		}
	}

	componentWillUnmount() {
		document.removeEventHandler("keydown");
	}

	newGame() {

		var paths = this.createPaths();
		this.setState({
				player: {
				hp: 30,
				atk: 7,
				lvl: 1,
				exp: 0,
				x: 0,
				y: 0
			},
			camX: -Math.floor(CAM_WIDTH / 2),
			camY: -Math.floor(CAM_HEIGHT / 2),
			paths,
			canStart: true,
			dead: false
		});
	}

	createPaths() {
		// create paths available for player

		var paths = [];
		for(var x = 0; x < WORLD_WIDTH; x++) {
			paths[x] = [];
			for(var y = 0; y < WORLD_HEIGHT; y++) {
				paths[x][y] = WALL;
			}
		}
		this.createRoom(0, paths, 0, 0);
		return paths;
	}

	createRoom(count, paths, x, y) {
		if(count > MAX_ROOM_NUM) return;
			// stop making room

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

				var rand = Math.random();
				if(rand < 0.01) {
					console.log("enemy", x + offX, y + offY)
					paths[x + offX][y + offY]	= ENEMY;	
					var enemy = {
						hp: 30
					};
					this.state.enemies["" + (x + offX) + "," + (y + offY)] = enemy;
						// use the coord as id
			//		console.log("enemy:", x, y);
				} else if(rand < 0.02) {
					paths[x + offX][y + offY] = LOOT;
				} else {
					paths[x + offX][y + offY] = PATH;
				}
			}
		}

		// create the next room
		var east = Math.random() < 0.5 ? true : false;
		if(y == WORLD_HEIGHT - 1 
				|| (east && x < WORLD_WIDTH - 1)) {
			// create next room in the east
			this.createRoom(++count, paths, x + width, y);
		} else if(!east) {
			// create next room in the south
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
						|| paths[x][y] == WALL) {
					// fill in with black
					// if cam outside the world
					// or if there's no path
					ctx.fillStyle = "#000000";

				} else if(x == player.x
						&& y == player.y) {
					// draw player green
					ctx.fillStyle = "#00ff00";

				} else if(paths[x][y] == PATH) {
					// draw paths yellow
					ctx.fillStyle = "#d2ef11";

				} else if(paths[x][y] == ENEMY) {
					// draw enemy red
					ctx.fillStyle = "#ff0000";

				} else if(paths[x][y] == LOOT) {
					ctx.fillStyle = "#0000ff";
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
				<p id="hp">HP: {this.state.player.hp}</p>
				<p id="atk">ATK: {this.state.player.atk}</p>
				<p id="lvl">LVL: {this.state.player.lvl}</p>
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
