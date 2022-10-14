import React from "react";
import { IPlayField, TShipAxisCoord } from "../../store/types";
import s from "./PlayerField.module.css";
import { ShipFragment } from "../ShipFragment/ShipFragment";
import { getFragKind } from "../../store/ship";

interface IPlayerFieldProps {
  field: IPlayField;
  showShips?: boolean;
  disabled?: boolean;
  onClick?: (x: TShipAxisCoord, y: TShipAxisCoord) => void;
}

export function PlayerField({
  field,
  showShips = true,
  disabled = true,
  onClick,
}: IPlayerFieldProps) {
  return (
    <table className={s.player_field}>
      <tbody>
        {field.cells.map((row, y) => (
          <tr key={y}>
            {row.map((cell, x) => (
              <td
                className={s.player_field__cell}
                key={x}
                onClick={() =>
                  !disabled &&
                  onClick &&
                  onClick(x as TShipAxisCoord, y as TShipAxisCoord)
                }
              >
                <div className={s.fragment}>
                  {showShips && (
                    <ShipFragment
                      kind={getFragKind(
                        field.ships,
                        x as TShipAxisCoord,
                        y as TShipAxisCoord
                      )}
                    />
                  )}
                </div>
                <div className={s.cell_shot}>{cell}</div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
