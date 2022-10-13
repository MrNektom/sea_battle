import React, { useEffect, useState } from "react";
import { IPlayField, IShip } from "../../store/types";
import { PlayerField } from "./PlayerField";
import { genShips } from "../../store/ship";
import s from "./EditablePlayerField.module.css";

interface IEditablePlayerFieldProps {
  field: IPlayField;
  onChange?: () => void;
}

export function EditablePlayerField({
  field,
  onChange,
}: IEditablePlayerFieldProps) {
  return (
    <div className={s.editable_player_field}>
      <PlayerField field={field} />
      <div style={{ display: "flex", placeItems: "center", flex: "1" }}>
        <button style={{ margin: "auto" }} onClick={onChange}>
          Shuffle
        </button>
      </div>
    </div>
  );
}
