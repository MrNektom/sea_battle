import { useEvent, useStore } from "effector-react";
import React, { useEffect, useState } from "react";
import { PlayerField } from "../../components/PlayerField/PlayerField";
import { genShips } from "../../store/ship";
import { $game, initPlayer1Field, initPlayer2Field } from "../../store/store";
import { IShip } from "../../store/types";

export function InitFieldScreen() {
  const game = useStore($game);
  const initPlayer1 = useEvent(initPlayer1Field);
  const initPlayer2 = useEvent(initPlayer2Field);
  const [ships, setShips] = useState<IShip[]>(() => genShips());
  const field =
    game.phase === "initPlayer1Field" ? game.player1.field : game.player2.field;

  function onConfirm() {
    if (ships.length === 0) {
      return;
    }
    if (game.phase === "initPlayer1Field") {
      setShips(genShips());
    }
    field.ships = ships;
    game.phase === "initPlayer1Field"
      ? initPlayer1(field)
      : game.phase === "initPlayer2Field"
      ? initPlayer2(field)
      : (() => {
          throw new Error("invalid game state");
        })();
  }
  useEffect(() => {
    field.ships = ships;
  }, [ships]);
  return (
    <div>
      <h2>
        Please select positions of{" "}
        {game.phase === "initPlayer1Field" ? "P1" : "P2"} ships
      </h2>
      <div style={{ display: "inline-block" }}>
        <PlayerField field={field} ships={ships} />
      </div>
      <div style={{ paddingTop: "20px" }}>
        <button onClick={() => setShips(genShips())}>Shuffle</button>
        <button onClick={onConfirm}>Submit</button>
      </div>
    </div>
  );
}
