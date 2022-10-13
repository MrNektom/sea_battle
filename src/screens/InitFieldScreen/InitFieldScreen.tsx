import { useEvent, useStore } from "effector-react";
import React, { useRef, useState } from "react";
import { match } from "ts-pattern";
import { EditablePlayerField } from "../../components/PlayerField/EditablePlayerField";
import { playerFieldInit } from "../../store/playerFieldInit";
import { genShips } from "../../store/ship";
import { $game, initPlayer1Field, initPlayer2Field } from "../../store/store";
import { IPlayField } from "../../store/types";

export function InitFieldScreen() {
  const game = useStore($game);
  const initPlayer1 = useEvent(initPlayer1Field);
  const initPlayer2 = useEvent(initPlayer2Field);
  const [field, setField] = useState<IPlayField>(() => ({
    cells: playerFieldInit(),
    ships: genShips(),
  }));

  function onConfirm() {
    if (field.ships.length === 0) {
      return;
    }
    if (game.phase === "initPlayer1Field") {
      setField({
        cells: playerFieldInit(),
        ships: genShips(),
      });
    }
    game.phase === "initPlayer1Field"
      ? initPlayer1(field)
      : game.phase === "initPlayer2Field"
      ? initPlayer2(field)
      : (() => {
          throw new Error("invalid game state");
        })();
  }

  return (
    <div>
      <h2>
        Please select positions of{" "}
        {game.phase === "initPlayer1Field" ? "P1" : "P2"} ships
      </h2>
      <EditablePlayerField
        field={field}
        onChange={() => setField({ cells: field.cells, ships: genShips() })}
      />
      <button onClick={onConfirm}>Submit</button>
    </div>
  );
}
