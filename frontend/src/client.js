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

const getClickedPosition = (element, event) => {
	//get position of clicked cell
	const rect = element.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;

	return { x, y };
};

const getBoard = (canvas, numCells = 15) => {
	//create board

	const ctx = canvas.getContext("2d");
	const cellSize = Math.floor(canvas.width / numCells);

	const fillCell = (x, y, color) => {
		ctx.fillStyle = color;
		ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
	};

	const drawGrid = () => {
		ctx.beginPath();
		for (let i = 0; i < numCells + 1; i++) {
			ctx.moveTo(i * cellSize, 0);
			ctx.lineTo(i * cellSize, cellSize * numCells);
			ctx.moveTo(0, i * cellSize);
			ctx.lineTo(cellSize * numCells, i * cellSize);
		}

		ctx.stroke();
	};

	const clear = () => {
		//clear board
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	};

	const renderBoard = (board = []) => {
		//render board
		board.forEach((row, y) => {
			row.forEach((color, x) => {
				color && fillCell(x, y, color);
			});
		});
	};

	const reset = (board) => {
		clear();
		drawGrid();
		renderBoard(board);
	};

	const getCellPosition = (x, y) => {
		//get position of cell
		return {
			x: Math.floor(x / cellSize),
			y: Math.floor(y / cellSize),
		};
	};

	return { fillCell, reset, getCellPosition };
};

const joinGame = () => {
	//do poprawy idk czy działa
	const code = document.getElementById("roomName").value; //get code from input
	socket.emit("join", code); //send code to server
	reset(code);
};

(() => {
	// const canvas = document.querySelector("canvas"); //get canvas
	const canvas = document.getElementById("gameScreen"); //get canvas
	const bench = document.getElementById("bench"); //get bench TODO: add bench with generated letter for players
	const scoreBoard = document.getElementById("scoreBoard"); //get score board TODO: add score board with current score and history of words
	const newGameButton = document.getElementById("newGame"); //get new game button
	const joinGameButton = document.getElementById("joinGame"); //get join game button
	const roomName = document.getElementById("roomName"); //get room input

	const { fillCell, reset, getCellPosition } = getBoard(canvas); //create board
	const socket = io(); //connect to server

	const onClick = (socket) => (e) => {
		//send turn to server
		const { x, y } = getClickedPosition(canvas, e);
		socket.emit("turn", getCellPosition(x, y));
	};

	socket.on("board", reset); //kiedy modal i przyciski bedą działać to to wywal
	socket.on("message", log);
	socket.on("turn", ({ x, y, color }) => fillCell(x, y, color));

	document //add event listeners in document
		.querySelector("#chat-form")
		.addEventListener("submit", onChatSubmitted(socket));

	// newGameButton.addEventListener("click", reset); //start new game, popraw bo to tylko przekopiowane
	// joinGameButton.addEventListener("click", joingame); //join existing game, popraw bo to tylko przekopiowane

	canvas.addEventListener("click", onClick(socket));
})();
