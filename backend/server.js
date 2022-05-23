const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const randomColor = require('randomcolor');
const createBoard = require('./getBoard');
const handleNewGame = require('./handleNewGame');

const app = express();

app.use(express.static("./frontend")); //connection to frontend side

const server = http.createServer(app);
const io = socketio(server);
const {clear, getBoard, makeTurn} = createBoard(15); //create board with 15x15 cells


io.on("connection", (socket) => {
	// client.on('click', handleNewGame);//jeszcze nie działa

	socket.emit("message", "Welcome to the game!"); //on connection to server send message to client

	const color = randomColor(); //generate random color for player
	socket.emit('board', getBoard()); //send board to client

	socket.on("message", (text) => io.emit("message", text)); //receive message from client and send it to all clients

	socket.on('turn', ({ x, y }) => {
		  const playerWon = makeTurn(x, y, color); //make turn on board
		  io.emit('turn', { x, y, color }); //send turn to all clients
	
		  if(playerWon) {
			io.emit('message', `${color} player won!`);
			io.emit('message', 'New Round');
			clear();
			io.emit('board');
		  }
	  });
});

server.on("error", (err) => {
	console.log(err);
});

server.listen(8080, () => {
	console.log("Server is running on port 8080");
});
