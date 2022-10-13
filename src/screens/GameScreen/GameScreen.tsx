import { useEvent, useStore } from "effector-react";
import React from "react";
import { PlayerField } from "../../components/PlayerField/PlayerField";
import { StepIndicator } from "../../components/StepIndicator/StepIndicator";
import { $game, nextStep } from "../../store/store";
import { TShipAxisCoord } from "../../store/types";
import s from "./GameScreen.module.css";

export function GameScreen() {
  const game = useStore($game);
  const nextStepEvent = useEvent(nextStep);

  function handleShot(x: TShipAxisCoord, y: TShipAxisCoord) {
    console.log(
      game.phase === "waitForPlayer1Step"
        ? game.player2.field.cells[y][x]
        : game.player1.field.cells[y][x]
    );

    if (
      (game.phase === "waitForPlayer1Step" &&
        game.player2.field.cells[y][x] === " ") ||
      (game.phase === "waitForPlayer2Step" &&
        game.player1.field.cells[y][x] === " ")
    ) {
      nextStepEvent([x, y]);
    }
  }
  return (
    <div className={s.game_screen}>
      <PlayerField
        field={game.player1.field}
        showShips={false}
        disabled={game.phase === "waitForPlayer1Step"}
        onClick={handleShot}
      />
      <StepIndicator
        dir={game.phase === "waitForPlayer1Step" ? "right" : "left"}
      />
      <PlayerField
        field={game.player2.field}
        showShips={false}
        disabled={game.phase === "waitForPlayer2Step"}
        onClick={handleShot}
      />
    </div>
  );
}
