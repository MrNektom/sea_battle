import { findShip, isDestroyed } from "./ship";
import { IPlayField, TShipAxisCoord } from "./types";

export function shotField(
  field: IPlayField,
  x: TShipAxisCoord,
  y: TShipAxisCoord
): [IPlayField, boolean] {
  let result = true;
  if (findShip(field.ships, x, y) !== null) {
    field.cells[y][x] = "×";
  } else {
    field.cells[y][x] = "・";

    result = false;
  }
  return [field, result];
}

export function isAllDestroyed(field: IPlayField): boolean {
  for (let i = 0; i < field.ships.length; i++) {
    if (!isDestroyed(field, i)) {
      return false;
    }
  }
  return true;
}
