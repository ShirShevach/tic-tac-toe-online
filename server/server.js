const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const emptyBoard = () => {
  return ["", "", "", "", "", "", "", "", ""];
};

// Define winning combinations (indices of the board)
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
];

let groups = {};
let waitingPlayer = new Set();

function checkWin(board, sign) {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] === sign && board[b] === sign && board[c] === sign) {
      return true;
    }
  }
  return false;
}

const handleMove = (socket, room, board, id, sign) => {
  board[id] = sign;
  socket.to(room).emit("sign on board", { id: id, sign: sign });
  socket.emit("sign on board", { id: id, sign: sign });
  if (checkWin(board, sign)) {
    socket.to(room).emit("winning", { sign: sign });
    socket.emit("winning", { sign: sign });
  }
};

const startPlay = (socket, room) => {
  socket.to(room).emit("start play", {
    ...groups[room][0],
    opponentName: groups[room][1].name,
  });
  socket.emit("start play", {
    ...groups[room][1],
    opponentName: groups[room][0].name,
  });
};

io.on("connection", (socket) => {
  const socketId = socket.id;
  console.log(`user connected ${socketId}`);

  socket.on("newPlayer", (player) => {
    console.log("I am in newPlayer");
    const { room, name } = player;
    if (room in groups) {
      if (groups[room].length === 1) {
        groups[room].push({ name: name, sign: "O" });
        groups[room].push(emptyBoard());
        socket.join(room);
        console.log(`Socket ${socketId} joined room: ${room}`);
        startPlay(socket, room);
      } else {
        socket.emit("joining a room", "this room is full");
      }
    } else {
      groups[room] = {};
      groups[room] = [{ name: name, sign: "X" }];
      socket.join(room);
      console.log(`Socket ${socketId} joined room: ${room}`);
      socket.emit("joining a room", "waiting for an opponent...");
    }
  });

  socket.on("hold square", (data) => {
    console.log(`The pressed square is ${data.id}`);
    handleMove(socket, data.room, groups[data.room][2], data.id, data.sign);
  });

  socket.on("new game", ({ room }) => {
    if (waitingPlayer.has(room)) {
      let board = groups[room][2];
      for (var i = 0; i < board.length; i++) {
        board[i] = "";
      }
      waitingPlayer.delete(room);
      socket.to(room).emit("new game", { sign: "X" });
      socket.emit("new game", { sign: "O" });
    } else {
      waitingPlayer.add(room);
      socket.to(room).emit("asking new game");
      socket.emit("waiting to other player");
    }
  });

  socket.on("leaving", ({ room, name }) => {
    // message to the other
    socket.to(room).emit("other player leave");
    // groups delete room
    delete groups[room];
  });
});

server.listen(3000, () => console.log("server is running"));
