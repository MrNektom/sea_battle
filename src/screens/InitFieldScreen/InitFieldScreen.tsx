import { useStore } from "effector-react";
import React from "react";
import { EditablePlayerField } from "../../components/PlayerField/EditablePlayerField";
import { $game } from "../../store/store";
import { EGamePhase } from "../../store/types";

export function InitFieldScreen() {
  const game = useStore($game);
  const phase = game.phase;
  const field =
    phase === EGamePhase.initPlayer1Field
      ? game.player1.field
      : game.player2.field;
  return (
    <div>
      <h2>Please select positions of your ships</h2>
      <EditablePlayerField field={field} />
      <button>Submit</button>
    </div>
  );
}
