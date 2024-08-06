import React from "react";

export default function Square(props) {
  const styles = {
    backgroundColor: props.isHeld ? shape() : "white",
  };

  function shape() {
    return props.value === "X" ? "#59E391" : "pink";
  }
  return (
    <div className="square-face" style={styles} onClick={props.holdSquare}>
      <h2 className="square-text">{props.value}</h2>
    </div>
  );
}
