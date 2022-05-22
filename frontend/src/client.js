const log = (text) => {
	const parent = document.querySelector("#events");
	const el = document.createElement("li");
	el.innerHTML = text;

	parent.appendChild(el);
	parent.scrollTop = parent.scrollHeight;
};

const onChatSubmitted = (socket) => (e) => {
	e.preventDefault();

	const input = document.querySelector("#chat");
	const text = input.value;
	input.value = "";

	socket.emit("message", text);
};

const getClickedPosition = (element, event) => {
	const rect = element.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;

	return { x, y };
};

const getBoard = (canvas, numCells = 15) => {
	const ctx = canvas.getContext("2d");
	const cellSize = Math.floor(canvas.width / numCells);

	const fillCell = (x, y, color) => {
		ctx.fillStyle = color;
		ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
	};

	// ctx.fillStyle = "white";
	// ctx.fillRect(0, 0, width, height);

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
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	};

	const reset = () => {
		clear();
		drawGrid();
	};

	const getCellPosition = (x, y) => {
		return {
			x: Math.floor(x / cellSize),
			y: Math.floor(y / cellSize),
		};
	};

	return { fillCell, reset, getCellPosition };
};

(() => {
	const canvas = document.querySelector("canvas");
	const { fillCell, reset, getCellPosition } = getBoard(canvas);
	const socket = io();

	const onClick = (socket) => (e) => {
		const { x, y } = getClickedPosition(canvas, e);
		socket.emit("turn", getCellPosition(x, y));
	};

	reset();

	socket.on("message", log);
	socket.on("turn", ({ x, y }) => fillCell(x, y, "blue"));

	document
		.querySelector("#chat-form")
		.addEventListener("submit", onChatSubmitted(socket));

	canvas.addEventListener("click", onClick(socket));
})();
