import React from "react";
import { IPlayField, TShipAxisCoord } from "../../store/types";
import s from "./PlayerField.module.css";
import { ShipFragment } from "../ShipFragment/ShipFragment";
import { getFragKind } from "../../store/ship";

interface IPlayerFieldProps {
  field: IPlayField;
}

export function PlayerField({ field }: IPlayerFieldProps) {
  return (
    <table className={s.player_field}>
      <tbody>
        {field.cells.map((row, y) => (
          <tr key={y}>
            {row.map((cell, x) => (
              <td className={s.player_field__cell} key={x}>
                {cell}
                <div className={s.fragment}>
                  <ShipFragment
                    kind={getFragKind(
                      field,
                      x as TShipAxisCoord,
                      y as TShipAxisCoord
                    )}
                  />
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
