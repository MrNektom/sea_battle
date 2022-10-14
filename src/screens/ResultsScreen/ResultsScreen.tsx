import { useEvent, useStore } from "effector-react";
import React from "react";
import { PlayerField } from "../../components/PlayerField/PlayerField";
import { $game, startGame } from "../../store/store";
import s from "./ResultsScreen.module.css";

export function ResultsScreen() {
  const game = useStore($game);
  const playAgain = useEvent(startGame);
  return (
    <div>
      <h1>Results</h1>
      <div className={s.flex}>
        <PlayerField field={game.player1.field} />
        <div style={{ width: "50px" }}></div>
        <PlayerField field={game.player2.field} />
      </div>
      <button onClick={playAgain}>Play again</button>
    </div>
  );
}
