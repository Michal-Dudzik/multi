//show initial screen modal
var initialScreen = new bootstrap.Modal(
	document.getElementById("initialScreen"),
	{}
);
initialScreen.toggle();

// open help modal
var helpModal = new bootstrap.Modal(document.getElementById("helpModal"), {});
var helpbtn = document.getElementById("help");
helpbtn.addEventListener("click", () => {
	helpModal.toggle();
});

const log = (text) => {
	//log to console
	const parent = document.querySelector("#events");
	const el = document.createElement("li");
	el.innerHTML = text;

	parent.appendChild(el);
	parent.scrollTop = parent.scrollHeight;
};

const onChatSubmitted = (socket) => (e) => {
	//send message to server
	e.preventDefault();

	const input = document.querySelector("#chat");
	const text = input.value;
	input.value = "";

	socket.emit("message", text);
};

(() => {
	const gameScreen = document.getElementById("gameScreen"); //get gameScreen
	const bench = document.getElementById("bench"); //get bench TODO: add bench with generated letter for players
	const scoreBoard = document.getElementById("scoreBoard"); //get score board TODO: add score board with current score and history of words
	const newGameButton = document.getElementById("newGame"); //get new game button
	const joinGameButton = document.getElementById("joinGame"); //get join game button
	const roomName = document.getElementById("roomName"); //get room input
	const playerName = document.getElementById("playerName"); //get player name input
	const acceptWord = document.getElementById("acceptWord"); //get accept word button
	const skip = document.getElementById("skip"); //get skip button

	const { fillCell, reset, getCellPosition } = getBoard(gameScreen); //create board

	const socket = io(); //connect to server

	const onClick = (socket) => (e) => {
		//send turn to server
		const { x, y } = getClickedPosition(gameScreen, e);
		socket.emit("turn", getCellPosition(x, y));
	};
	socket.on("joinroom")
	socket.on("board", reset); //kiedy modal i przyciski bedą działać to to wywal
	// socket.on("bench", resetBench); //kiedy modal i przyciski bedą działać to to wywal
	socket.on("message", log);
	socket.on("turn", ({ x, y, color }) => fillCell(x, y, color));

	document //add event listeners in document
		.querySelector("#chat-form")
		.addEventListener("submit", onChatSubmitted(socket));

	// newGameButton.addEventListener("click", reset); //start new game, popraw bo to tylko przekopiowane
	// joinGameButton.addEventListener("click", joingame); //join existing game, popraw bo to tylko przekopiowane
	gameScreen.addEventListener("click", onClick(socket));
})();
