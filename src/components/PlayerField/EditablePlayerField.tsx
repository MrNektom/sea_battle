import React, { useEffect, useState } from "react";
import { IPlayField, IShip } from "../../store/types";
import { PlayerField } from "./PlayerField";
import { generateShips } from "../../store/ship";
import s from "./EditablePlayerField.module.css";

interface IEditablePlayerFieldProps {
  field: IPlayField;
  onChange?: (field: IPlayField) => void;
}

export function EditablePlayerField({ field }: IEditablePlayerFieldProps) {
  const [ships, setShips] = useState<IShip[]>([]);

  useEffect(() => {
    setShips(generateShips());
  }, []);

  function onShuffle() {
    setShips(generateShips());
  }
  return (
    <div className={s.editable_player_field}>
      <PlayerField field={{ cells: field.cells, ships }} />
      <div style={{ display: "flex", placeItems: "center", flex: "1" }}>
        <button style={{ margin: "auto" }} onClick={onShuffle}>
          Shuffle
        </button>
      </div>
    </div>
  );
}
