import React from "react";
import { IPlayField } from "../../store/types";
import s from "./EditablePlayerField.module.css";
import { PlayerField } from "../PlayerField/PlayerField";

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
