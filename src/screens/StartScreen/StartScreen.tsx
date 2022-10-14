import { useEvent, useStore } from "effector-react";
import React from "react";
import { $game, startGame } from "../../store/store";

export function StartScreen() {
  const game = useStore($game);

  const startEvent = useEvent(startGame);
  return (
    <div>
      <h1 style={{ paddingBottom: "100px" }}>Sea Battle</h1>
      <button onClick={() => startEvent()}>Start Game</button>
    </div>
  );
}
