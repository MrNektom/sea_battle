import { useStore } from "effector-react";
import React from "react";
import { PlayerField } from "../../components/PlayerField/PlayerField";
import { StepIndicator } from "../../components/StepIndicator/StepIndicator";
import { isAllDestroyed } from "../../store/field";
import { $game } from "../../store/store";

export function ResultsScreen() {
  const game = useStore($game);
  return (
    <div>
      <PlayerField field={game.player1.field} />
      <div></div>
      <PlayerField field={game.player2.field} />
    </div>
  );
}
