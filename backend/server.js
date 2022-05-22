const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const randomColor = require("randomcolor");

const app = express();

app.use(express.static(`${__dirname}/../frontend`));

const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
	socket.emit("message", "Welcome to the game!");

	socket.on("message", (text) => io.emit("message", text));

	socket.on("turn", ({ x, y }) => io.emit("turn", { x, y }));
});

server.on("error", (err) => {
	console.log(err);
});

server.listen(8080, () => {
	console.log("Server is running on port 8080");
});
