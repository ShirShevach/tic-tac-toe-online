import React, { useState } from "react";

function FisrtPage({ setPlayer, msgFromServer }) {
  const [localName, setLocalName] = useState("");
  const [localRoom, setLocalRoom] = useState(0);

  const updateNewPlayer = (event) => {
    // set new player {name, room}
    console.log("updateNewPlayer");
    setPlayer({ name: localName, room: localRoom });
  };

  return (
    <div>
      <p>
        <label>Enter a name </label>
        <input
          placeholder="name..."
          onChange={(event) => setLocalName(event.target.value)}
        ></input>
      </p>
      <p>
        <label>Enter a room </label>
        <input
          placeholder="room..."
          onChange={(event) => setLocalRoom(event.target.value)}
        ></input>
      </p>
      <button className="my-button" onClick={updateNewPlayer}>
        Search for an opponent
      </button>
      {msgFromServer && <h4>{msgFromServer}</h4>}
    </div>
  );
}

export default FisrtPage;
