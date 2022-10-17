import {
  asCoordArray,
  findShipIndex,
  getAroundZone,
  getBody,
  getCollisionZone,
  isDestroyed,
} from "./ship";
import { IPlayField, IShip, TShipAxisCoord, TFieldCell } from "./types";

export function shotField(
  field: IPlayField,
  x: TShipAxisCoord,
  y: TShipAxisCoord
): [IPlayField, boolean, number] {
  let result = true;
  const index: number = findShipIndex(field.ships, x, y);
  if (index !== -1) {
    field.cells[y][x] = "×";
    if (isDestroyed(field, index)) {
      shotAroundShip(field, index);
    }
  } else {
    field.cells[y][x] = "・";

    result = false;
  }
  return [field, result, index];
}

function shotAroundShip(field: IPlayField, index: number) {
  const collisionZone = getAroundZone(field.ships[index]);
  collisionZone.forEach(([x, y]) => {
    field.cells[y][x] = "・";
  });
}

export function isAllDestroyed(field: IPlayField): boolean {
  for (let i = 0; i < field.ships.length; i++) {
    if (!isDestroyed(field, i)) {
      return false;
    }
  }
  return true;
}

export class Field {
  ships: IShip[];
  shots: [TShipAxisCoord, TShipAxisCoord, TFieldCell][];

  constructor() {
    this.ships = [];
    this.shots = [];
  }

  shot(x: TShipAxisCoord, y: TShipAxisCoord) {
    let result = true;
    const index: number = findShipIndex(this.ships, x, y);
    if (index !== -1) {
      this.shots.push([x, y, "×"]);
      if (this.isDestroyed(index)) {
        this.shotAroundShip(index);
      }
    } else {
      this.shots.push([x, y, "・"]);

      result = false;
    }
    return [result, index];
  }
  isDestroyed(index: number): boolean {
    const body = getBody(this.ships[index]);

    for (let i = 0; i < body.length; i++) {
      const [x, y] = body[i];
      if (this.getShot(x, y) === " ") {
        return false;
      }
    }
    return true;
  }
  isAllDestroyed(): boolean {
    for (let i = 0; i < this.ships.length; i++) {
      if (!this.isDestroyed(i)) {
        return false;
      }
    }
    return true;
  }

  shotAroundShip(index: number) {
    const collisionZone = getAroundZone(this.ships[index]);
    collisionZone.forEach(([x, y]) => {
      this.shot(x, y);
    });
  }

  getShot(x: TShipAxisCoord, y: TShipAxisCoord): TFieldCell {
    return this.shots.find(([sx, sy]) => sx === x && sy === y)?.[2] || " ";
  }
}
