import React, { useState, useEffect } from "react";
import "./App.css";
import io from "socket.io-client";
import FisrtPage from "./components/FirstPage";
import Game from "./components/Game";

const socket = io.connect("http://localhost:3000");

function App() {
  const [fisrtPage, setFisrtPage] = useState(true);
  const [player, setPlayer] = useState(null);
  const [mySign, setMySign] = useState("");
  const [myTurn, setMyTurn] = useState(true);
  const [msgFromServer, setMsgFromServer] = useState(null);
  const [room, setRoom] = useState(null);
  const [opponentName, setOpponentName] = useState(null);
  const [c, setC] = useState(null);

  useEffect(() => {
    if (player) {
      console.log("hi");
      socket.emit("newPlayer", player);
      console.log(`new player in room ${player.room}`);
      setRoom(player.room);
    }
  }, [player]);

  useEffect(() => {
    setMyTurn((prev) => !prev);
  }, [c]);

  useEffect(() => {
    socket.on("joining a room", (data) => {
      setMsgFromServer(data);
    });

    socket.on("start play", (data) => {
      setMySign(data.sign);
      data.sign === "O" ? setMyTurn(false) : setMyTurn(true);
      setOpponentName(data.opponentName);
      setFisrtPage(false);
      setMsgFromServer(null);
    });
  }, [socket]);

  return (
    <div className="App">
      <header className="App-header">
        TIC TAC TOE
        {fisrtPage ? (
          <FisrtPage setPlayer={setPlayer} msgFromServer={msgFromServer} />
        ) : (
          <Game
            socket={socket}
            room={room}
            name={player.name}
            sign={mySign}
            myTurn={myTurn}
            setMyTurn={setMyTurn}
            opponentName={opponentName}
            setC={setC}
            setFisrtPage={setFisrtPage}
          />
        )}
      </header>
    </div>
  );
}

export default App;
