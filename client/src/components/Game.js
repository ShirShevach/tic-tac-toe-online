import React, { useState, useEffect } from "react";
import Square from "./Square";
import Confetti from "react-confetti";
import BottomLine from "./BottomLine";
import Popup from "./Popup/Popup";

export default function Game({
  socket,
  room,
  name,
  sign,
  myTurn,
  setMyTurn,
  opponentName,
  setC,
  setFisrtPage,
}) {
  const [board, setBoard] = useState(createEmptyBoard());
  const [winner, setWinner] = useState(null);
  const [waitingState, setWaitingState] = useState(false);
  const [popUp, setPopup] = useState(false);
  const [showNewGameInPopUP, setShowNewGameInPopUP] = useState(true);

  function generateNewSquare(i) {
    return {
      id: i,
      value: null,
      isHeld: false,
    };
  }

  function createEmptyBoard() {
    const newBoard = [];
    for (let i = 0; i < 9; i++) {
      newBoard.push(generateNewSquare(i));
    }
    return newBoard;
  }

  const boardElements = board.map((square) => (
    <Square
      key={square.id}
      value={square.value}
      isHeld={square.isHeld}
      holdSquare={() => holdSquare(square.id)}
    />
  ));

  useEffect(() => {
    socket.on("sign on board", (data) => {
      console.log("we in Game.js, sign on board");
      const squareToUpdate = board.find((square) => square.id === data.id);

      setBoard((oldBoard) =>
        oldBoard.map((square) =>
          square.id === data.id
            ? { ...square, value: data.sign, isHeld: true }
            : square
        )
      );
      setC((prev) => (prev += 1));
    });

    socket.on("winning", ({ sign }) => {
      setWinner(sign);
      setMyTurn(false);
    });

    socket.on("waiting to other player", () => {
      setWaitingState(true);
    });

    socket.on("asking new game", () => {
      setPopup(true);
    });

    socket.on("new game", ({ sign }) => {
      setWaitingState(false);
      sign === "O" ? setMyTurn(false) : setMyTurn(true);
    });

    socket.on("other player leave", () => {
      setShowNewGameInPopUP(false);
      setPopup(true);
    });
  }, [socket]);

  function holdSquare(id) {
    if (myTurn) {
      const squareToUpdate = board.find((square) => square.id === id);
      if (!squareToUpdate || squareToUpdate.isHeld) {
        return;
      }
      console.log(`hold square!!! in room ${room}`);
      socket.emit("hold square", { room, id, sign });
    }
  }

  const topMessage = () => {
    if (waitingState) {
      return `waiting to ${opponentName}...`;
    }
    if (winner) {
      console.log("sign: ", sign);
      console.log("winner: ", winner);
      if (sign === winner) {
        return "You won the game!";
      } else {
        return `${opponentName} won the game...`;
      }
    } else {
      if (myTurn) {
        return "Your turn!";
      } else {
        return `${opponentName}'s turn`;
      }
    }
  };

  const handleNewGame = () => {
    socket.emit("new game", { room: room });
    // need!!!
    setBoard(createEmptyBoard);
    setWinner(null);
    setPopup(false);
  };

  const handleLeavingGame = () => {
    socket.emit("leaving", { room: room, name: name });
    setBoard(createEmptyBoard);
    setWinner(null);
    setShowNewGameInPopUP(true);
    setPopup(false);
    setFisrtPage(true);
  };

  return (
    <>
      {winner && sign === winner && <Confetti />}
      <p className="instructions">{topMessage()}</p>
      <div className="board-container">{boardElements}</div>
      <BottomLine
        handleNewGame={handleNewGame}
        showNewGame={true}
        handleLeavingGame={handleLeavingGame}
      />
      {popUp && (
        <Popup
          opponentName={opponentName}
          handleNewGame={handleNewGame}
          showNewGame={showNewGameInPopUP}
          handleLeavingGame={handleLeavingGame}
        />
      )}
    </>
  );
}
