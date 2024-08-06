import React from "react";
import BottomLine from "../BottomLine";
import "./Popup.css";

export default function Popup(props) {
  return (
    <div className="popup">
      <div className="overlay"></div>
      <div className="popup-inner">
        {props.showNewGame
          ? `${props.opponentName} is asking for another game`
          : `${props.opponentName} left the game`}
        <BottomLine
          handleNewGame={props.handleNewGame}
          showNewGame={props.showNewGame}
          handleLeavingGame={props.handleLeavingGame}
        />
      </div>
    </div>
  );
}
