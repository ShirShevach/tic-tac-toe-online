import React from "react";

export default function BottomLine(props) {
  return (
    <div className="bottom-line">
      {props.showNewGame && (
        <button className="my-button" onClick={props.handleNewGame}>
          new game
        </button>
      )}
      {"                     "}
      <button className="my-button" onClick={props.handleLeavingGame}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          class="bi bi-house-door"
          viewBox="0 0 16 16"
          style={{
            display: "block", // To center the SVG within the button
            margin: "auto", // To center the SVG within the button
          }}
        >
          <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146ZM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5Z" />
        </svg>
      </button>
    </div>
  );
}
