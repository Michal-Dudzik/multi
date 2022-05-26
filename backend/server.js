const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();

app.use(express.static("./frontend")); //connection to frontend side

const server = http.createServer(app);
const io = socketio(server);

var clientNo = 0;
var roomID;
var serverplayers = [];
var serverboards = [];

io.on("createnewgame", (socket) => {
	roomID = socket.id;
	console.log("Room: " + roomID + " was created");
	socket.join(roomID);
	console.log("New player:" + clientNo + ", joined room: " + roomID);
	serverplayers[socket.id] = new Player(socket.id); //adding player to list of players
	serverboards[roomID] = new Board(roomID); //creating new board
	serverboards[roomID].player1 = serverplayers[socket.id]; //adding player to board
});

io.on("joinroom", (socket) => {
	// listen for incoming data msg on this newly connected socket
	socket.on("data", function (data) {
		//wysyłąnie/odbieranie jsona
		console.log(`data received is '${data}'`);
		roomID = data;
		socket.join(roomID); //()
		serverplayers[socket.id] = new Player(socket.id); //adding player to list of players
		serverboards[roomID].player2 = serverplayers[socket.id]; //adding player to board
		console.log("New player:" + clientNo + ", joined room: " + roomID);
		serverboards[roomID].startgame();
		serverboards[roomID].player1.printplayershand(); //prints players hand (just for test)
		serverboards[roomID].player2.printplayershand(); //prints players hand (just for test)
		serverboards[roomID].howmanytilesinstorage(); //prints how many tiles are left in storage
	});
});

// io.on("joinrandomroom", (socket) => { //może kiedyś
// 	//szukaj pokoju ktory ma tylko
// 	serverplayers[socket.id] = new Player(socket.id); //adding player to list of players
//     serverboards[roomID].player2 = serverplayers[socket.id]; //adding player to board
//     console.log("Player: " + socket.id + " was asigned to board and his nick is: " + serverboards[roomID].player2.nickname);
// })

io.on("connection", (socket) => {
	socket.emit("message", "Welcome to the game!"); //on connection to server send message to client

	socket.on("message", (text) => io.emit("message", text)); //receive message from client and send it to all clients
});

server.on("error", (err) => {
	console.log(err);
});

server.listen(8080, () => {
	console.log("Server is running on port 8080");
});

///////////////////////////// DO POSPRZĄTANIA //////////////////////

var Game = /** @class */ (function () {
	function Game(board) {
		this.board = board;
	}
	Game.prototype.startgame = function () {
		this.board.GenerateEmptyBoard();
		this.board.filltilestorage();
		this.board.player1.fillplayershand(this.board.unusedtilestorage);
		this.board.player2.fillplayershand(this.board.unusedtilestorage);
		this.round = 0;
	};
	Game.prototype.gameloop = function () {
		if ((this.gameover = false)) {
			if (this.round % 2 === 1) {
				//player 1 turn
			} else if (this.round % 2 === 0) {
				//player 2 turn
			}
		}
	};
	return Game;
})();
var Board = /** @class */ (function () {
	function Board(serverroomid) {
		this.gameboard = []; //type any because every other type created problems
		this.unusedtilestorage = []; //array storing lettertiles
		this.id = serverroomid;
		this.gameover = false;
	}
	Board.prototype.startgame = function () {
		this.GenerateEmptyBoard();
		this.filltilestorage();
		this.player1.fillplayershand(this.unusedtilestorage);
		this.player2.fillplayershand(this.unusedtilestorage);
	};
	Board.prototype.GenerateEmptyBoard = function () {
		//method generating board and filling it with empty tiles
		var rows = 15;
		var columns = 15;
		for (var row = 0; row < rows + 1; row++) {
			this.gameboard[row] = [
				new EmptyTile(),
				new EmptyTile(),
				new EmptyTile(),
				new EmptyTile(),
				new EmptyTile(),
				new EmptyTile(),
				new EmptyTile(),
				new EmptyTile(),
				new EmptyTile(),
				new EmptyTile(),
				new EmptyTile(),
				new EmptyTile(),
				new EmptyTile(),
				new EmptyTile(),
				new EmptyTile(),
			];
		}
		console.log("board has been generated");
	};
	Board.prototype.PrintBoard = function () {
		//printing whole board in console (just for testing)
		var rows = 15;
		var columns = 15;
		for (var row = 0; row < rows + 1; row++) {
			console.log(
				this.gameboard[row][0].type,
				this.gameboard[row][1].type,
				this.gameboard[row][2].type,
				this.gameboard[row][3].type,
				this.gameboard[row][4].type,
				this.gameboard[row][5].type,
				this.gameboard[row][6].type,
				this.gameboard[row][7].type,
				this.gameboard[row][8].type,
				this.gameboard[row][9].type,
				this.gameboard[row][10].type,
				this.gameboard[row][11].type,
				this.gameboard[row][12].type,
				this.gameboard[row][13].type,
				this.gameboard[row][14].type
			);
		}
	};
	Board.prototype.howmanytilesinstorage = function () {
		//prints how many tiles are left in unusedtilestorage
		console.log(this.unusedtilestorage.length);
	};
	Board.prototype.filltilestorage = function () {
		//create an array of all letters with their values, state, id
		this.unusedtilestorage.push(
			new LetterTile(0, 0, "Blank", 0),
			new LetterTile(1, 0, "Blank", 0),
			new LetterTile(2, 1, "A", 0),
			new LetterTile(3, 1, "A", 0),
			new LetterTile(4, 1, "A", 0),
			new LetterTile(5, 1, "A", 0),
			new LetterTile(6, 1, "A", 0),
			new LetterTile(7, 1, "A", 0),
			new LetterTile(8, 1, "A", 0),
			new LetterTile(9, 1, "A", 0),
			new LetterTile(10, 1, "A", 0),
			new LetterTile(11, 3, "B", 0),
			new LetterTile(12, 3, "B", 0),
			new LetterTile(13, 3, "C", 0),
			new LetterTile(14, 3, "C", 0),
			new LetterTile(15, 2, "D", 0),
			new LetterTile(16, 2, "D", 0),
			new LetterTile(17, 2, "D", 0),
			new LetterTile(18, 2, "D", 0),
			new LetterTile(19, 1, "E", 0),
			new LetterTile(20, 1, "E", 0),
			new LetterTile(21, 1, "E", 0),
			new LetterTile(22, 1, "E", 0),
			new LetterTile(23, 1, "E", 0),
			new LetterTile(24, 1, "E", 0),
			new LetterTile(25, 1, "E", 0),
			new LetterTile(26, 1, "E", 0),
			new LetterTile(27, 1, "E", 0),
			new LetterTile(28, 1, "E", 0),
			new LetterTile(29, 1, "E", 0),
			new LetterTile(30, 1, "E", 0),
			new LetterTile(31, 4, "F", 0),
			new LetterTile(32, 4, "F", 0),
			new LetterTile(33, 2, "G", 0),
			new LetterTile(34, 2, "G", 0),
			new LetterTile(35, 2, "G", 0),
			new LetterTile(36, 4, "H", 0),
			new LetterTile(37, 4, "H", 0),
			new LetterTile(38, 1, "I", 0),
			new LetterTile(39, 1, "I", 0),
			new LetterTile(40, 1, "I", 0),
			new LetterTile(41, 1, "I", 0),
			new LetterTile(42, 1, "I", 0),
			new LetterTile(43, 1, "I", 0),
			new LetterTile(44, 1, "I", 0),
			new LetterTile(45, 1, "I", 0),
			new LetterTile(46, 1, "I", 0),
			new LetterTile(47, 8, "J", 0),
			new LetterTile(48, 5, "K", 0),
			new LetterTile(49, 1, "L", 0),
			new LetterTile(50, 1, "L", 0),
			new LetterTile(51, 1, "L", 0),
			new LetterTile(52, 1, "L", 0),
			new LetterTile(53, 3, "M", 0),
			new LetterTile(54, 3, "M", 0),
			new LetterTile(55, 1, "N", 0),
			new LetterTile(56, 1, "N", 0),
			new LetterTile(57, 1, "N", 0),
			new LetterTile(58, 1, "N", 0),
			new LetterTile(59, 1, "N", 0),
			new LetterTile(60, 1, "N", 0),
			new LetterTile(61, 1, "O", 0),
			new LetterTile(62, 1, "O", 0),
			new LetterTile(63, 1, "O", 0),
			new LetterTile(64, 1, "O", 0),
			new LetterTile(65, 1, "O", 0),
			new LetterTile(66, 1, "O", 0),
			new LetterTile(67, 1, "O", 0),
			new LetterTile(68, 1, "O", 0),
			new LetterTile(69, 3, "P", 0),
			new LetterTile(70, 3, "P", 0),
			new LetterTile(71, 10, "Q", 0),
			new LetterTile(72, 1, "R", 0),
			new LetterTile(73, 1, "R", 0),
			new LetterTile(74, 1, "R", 0),
			new LetterTile(75, 1, "R", 0),
			new LetterTile(76, 1, "R", 0),
			new LetterTile(77, 1, "R", 0),
			new LetterTile(78, 1, "S", 0),
			new LetterTile(79, 1, "S", 0),
			new LetterTile(80, 1, "S", 0),
			new LetterTile(81, 1, "S", 0),
			new LetterTile(82, 1, "T", 0),
			new LetterTile(83, 1, "T", 0),
			new LetterTile(84, 1, "T", 0),
			new LetterTile(85, 1, "T", 0),
			new LetterTile(86, 1, "T", 0),
			new LetterTile(87, 1, "T", 0),
			new LetterTile(88, 1, "U", 0),
			new LetterTile(89, 1, "U", 0),
			new LetterTile(90, 1, "U", 0),
			new LetterTile(91, 1, "U", 0),
			new LetterTile(92, 4, "V", 0),
			new LetterTile(93, 4, "V", 0),
			new LetterTile(94, 4, "W", 0),
			new LetterTile(95, 4, "W", 0),
			new LetterTile(96, 8, "X", 0),
			new LetterTile(97, 4, "Y", 0),
			new LetterTile(98, 4, "Y", 0),
			new LetterTile(99, 10, "Z", 0)
		);
	};
	return Board;
})();
var EmptyTile = /** @class */ (function () {
	function EmptyTile() {
		this.id = 0;
		this.type = "Empty";
		this.value = 0;
		this.status = 3;
	}
	return EmptyTile;
})();
var LetterTile = /** @class */ (function () {
	function LetterTile(
		id,
		value,
		type,
		status // TO DO
	) {
		this.id = id;
		this.value = value;
		this.status = status;
		this.type = type;
	}
	return LetterTile;
})();
var Player = /** @class */ (function () {
	function Player(
		socketid //TO DO
	) {
		this.playerhand = []; //array storing letters currently held by player
		this.playerhand = [];
		this.id = socketid;
		this.nickname = "Harold"; //If we have too much time we can add this functionality
		this.score = 0;
	}
	Player.prototype.printplayershand = function () {
		//prints players hand in console
		console.log("PLayer " + this.id + " has those tiles in hand:");
		for (var i = 0; i < this.playerhand.length; i++) {
			console.log(this.playerhand[i]);
		}
	};
	Player.prototype.fillplayershand = function (
		unusedtilestorage //used at start of game to give player tiles to play with
	) {
		for (
			var i = 0;
			i < 7;
			i++ //draws few tiles to fill players hand
		) {
			var newtile =
				unusedtilestorage[Math.floor(Math.random() * unusedtilestorage.length)]; //find random tile from unusedtilestorage
			unusedtilestorage.splice(unusedtilestorage.indexOf(newtile), 1); //remove tile from unusedtilestorage
			newtile.status = 1; //because it lands in players hand
			this.playerhand.push(newtile);
			unusedtilestorage.splice(unusedtilestorage.indexOf(newtile), 1); //remove tile from unusedtilestorage
			var stand = document.getElementById("stand");
			var newtilehtml = document.createElement("div"); //generate div for the tile inside tile class
			newtilehtml.classList.add("tile");
			// serverplayers[socket.id].playerhand[1].type;
			// serverplayers[socket.id].playerhand[1].value;
		}
		console.log("Player's hand has been filled");
	};
	Player.prototype.tradetiles = function (
		chosentile,
		unusedtilestorage //TO DO removes tile chosen by player from his hand and gives him random one from unusedtilestorage
	) {
		var index = this.playerhand
			.map(function (object) {
				return object.id;
			})
			.indexOf(chosentile.id); //find index of choesentile
		this.playerhand.splice(index, 1); //remove chosentile from players hand
		var newtile =
			unusedtilestorage[Math.floor(Math.random() * unusedtilestorage.length)]; //find random tile from unusedtilestorage
		unusedtilestorage.push(chosentile); //return tile to unusedtilestorage
		this.playerhand.push(newtile);
		console.log(
			"Tile {0} has been removed from players hand and tile {1} has been added",
			chosentile.value,
			newtile.value
		);
	};
	Player.prototype.drawtile = function (
		unusedtilestorage //used at end of each round
	) {
		var newtile =
			unusedtilestorage[Math.floor(Math.random() * unusedtilestorage.length)]; //find random tile from unusedtilestorage
		unusedtilestorage.splice(unusedtilestorage.indexOf(newtile), 1); //remove tile from unusedtilestorage
		this.playerhand.push(newtile);
		console.log("TIle {0} has been added to players hand", newtile.value);
	};
	return Player;
})();
