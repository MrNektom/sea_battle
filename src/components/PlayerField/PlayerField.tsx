import React from "react";
import { IShip, TShipAxisCoord } from "../../store/types";
import s from "./PlayerField.module.css";
import { ShipFragment } from "../ShipFragment/ShipFragment";
import { getFragKind } from "../../store/ship";
import { range } from "../../store/utils";
import { Field } from "../../store/field";

interface IPlayerFieldProps {
  field: Field;
  ships?: IShip[];
  showShips?: boolean;
  disabled?: boolean;
  onClick?: (x: TShipAxisCoord, y: TShipAxisCoord) => void;
}

export function PlayerField({
  field,
  ships,
  showShips = true,
  disabled = true,
  onClick,
}: IPlayerFieldProps) {
  console.log(field, ships);

  return (
    <div className={s.player_field__wrapper}>
      <div className={s.player_field__horisontal_axis}>
        {["а", "б", "в", "г", "д", "е", "ё", "ж"].map((k) => (
          <div key={k}>{k}</div>
        ))}
      </div>

      <div className={s.player_field__vertical_axis}>
        {range(8).map((k) => (
          <div key={k}>{k + 1}</div>
        ))}
      </div>
      <table className={s.player_field}>
        <tbody>
          {range(8).map((y) => (
            <tr key={y}>
              {range(8).map((x) => (
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
                          ships ? ships : field.ships,
                          x as TShipAxisCoord,
                          y as TShipAxisCoord
                        )}
                      />
                    )}
                  </div>
                  <div className={s.cell_shot}>
                    {field.getShot(x as TShipAxisCoord, y as TShipAxisCoord)}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
