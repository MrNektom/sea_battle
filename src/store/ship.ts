import { match } from "ts-pattern";
import {
  IFieldRect,
  IPlayField,
  IShip,
  TShipAxisCoord,
  TShipFragment,
  TShipKind,
  TShipOrientation,
} from "./types";
import { range } from "./utils";

export function getFragKind(
  ships: IShip[],
  x: TShipAxisCoord,
  y: TShipAxisCoord
): TShipFragment | null {
  return match<IShip | null, TShipFragment>(findShip(ships, x, y))
    .with(
      {},
      (ship) => isProw(ship, x, y),
      (ship) =>
        match<TShipOrientation, TShipFragment>(ship.orientation)
          .with("horisontal", () => "prowR")
          .with("vertical", () => "prowB")
          .otherwise(() => "none")
    )
    .with(
      {},
      (ship) => isMiddle(ship, x, y),
      (ship) =>
        match<TShipOrientation, TShipFragment>(ship.orientation)
          .with("horisontal", () => "middleH")
          .with("vertical", () => "middleV")
          .otherwise(() => "none")
    )
    .with(
      {},
      (ship) => isStern(ship, x, y),
      (ship) =>
        match<TShipOrientation, TShipFragment>(ship.orientation)
          .with("horisontal", () => "sternL")
          .with("vertical", () => "sternT")
          .exhaustive()
    )
    .otherwise(() => "none");
}

export function findShip(
  ships: IShip[],
  x: TShipAxisCoord,
  y: TShipAxisCoord
): IShip | null {
  for (let i = 0; i < ships.length; i++) {
    const ship = ships[i];
    if (hasShipOnCoords(ship, x, y)) {
      return ship;
    }
  }
  return null;
}

function getShipLength(ship: IShip): number {
  return match<TShipKind, number>(ship.kind)
    .with("sloop", () => 2)
    .with("cruiser", () => 3)
    .with("battleship", () => 4)
    .otherwise(() => 0);
}

export function hasShipOnCoords(
  ship: IShip,
  x: TShipAxisCoord,
  y: TShipAxisCoord
): boolean {
  return isProw(ship, x, y) || isMiddle(ship, x, y) || isStern(ship, x, y);
}

export function isProw(
  ship: IShip,
  x: TShipAxisCoord,
  y: TShipAxisCoord
): boolean {
  return match({ x, y })
    .with({ x: ship.x, y: ship.y }, () => true)
    .otherwise(() => false);
}

export function isMiddle(
  ship: IShip,
  x: TShipAxisCoord,
  y: TShipAxisCoord
): boolean {
  const length = getShipLength(ship);

  return match(ship)
    .with(
      { orientation: "horisontal", y },
      () => ship.x > x && ship.x - (length - 1) < x
    )
    .with(
      { orientation: "vertical", x },
      () => ship.y > y && ship.y - (length - 1) < y
    )
    .otherwise(() => false);
}

export function isStern(
  ship: IShip,
  x: TShipAxisCoord,
  y: TShipAxisCoord
): boolean {
  const length = getShipLength(ship);
  return match(ship)
    .with({ orientation: "horisontal", y }, () => ship.x - (length - 1) === x)
    .with({ orientation: "vertical", x }, () => ship.y - (length - 1) === y)
    .otherwise(() => false);
}

/**
 * Generates ship list for new shipfield.
 */
export function genShips(): IShip[] {
  let ship: IShip | null = null;
  const list: IShip[] = [];
  while (hasAdd(list)) {
    ship = genShip();
    if (
      isOutOfField(ship) ||
      hasCollisions(list, ship) ||
      hasKind(list, ship)
    ) {
      continue;
    }
    list.push(ship);
  }
  return list;
}

function genAxisCoord(): TShipAxisCoord {
  return Math.round(Math.random() * 8) as TShipAxisCoord;
}

function genOrientation(): TShipOrientation {
  return match<number, TShipOrientation>(Math.round(Math.random()))
    .with(0, () => "horisontal")
    .otherwise(() => "vertical");
}

function genShipKind(): TShipKind {
  return match<0 | 1 | 2, TShipKind>(Math.round(Math.random() * 2) as 0 | 1 | 2)
    .with(0, () => "sloop")
    .with(1, () => "cruiser")
    .with(2, () => "battleship")
    .exhaustive();
}

function genShip(): IShip {
  return {
    kind: genShipKind(),
    orientation: genOrientation(),
    x: genAxisCoord(),
    y: genAxisCoord(),
  };
}

function hasAdd(list: IShip[]): boolean {
  let sloop = 0;
  let cruiser = 0;
  let battleship = 0;

  list.forEach((ship) => {
    if (ship.kind === "sloop") {
      sloop++;
    }
    if (ship.kind === "cruiser") {
      cruiser++;
    }
    if (ship.kind === "battleship") {
      battleship++;
    }
  });
  if (battleship >= 1 && cruiser >= 2 && sloop >= 3) {
    return false;
  }
  return true;
}

export function getCollisionZone(ship: IShip): IFieldRect {
  const length = getShipLength(ship);
  const x1 = match(ship.orientation)
    .with("horisontal", () => ship.x - length)
    .otherwise(() => ship.x - 1);
  const x2 = ship.x + 1;
  const y1 = match(ship.orientation)
    .with("horisontal", () => ship.y - 1)
    .otherwise(() => ship.y - length);
  const y2 = ship.y + 1;
  return {
    x: x1,
    y: y1,
    w: x2 - x1 + 1,
    h: y2 - y1 + 1,
  };
}

export function isOutOfField(ship: IShip): boolean {
  const length = getShipLength(ship) - 1;

  return match(ship.orientation)
    .with(
      "horisontal",
      () => ship.x - length < 0 || ship.x > 7 || ship.y < 0 || ship.y > 7
    )
    .with(
      "vertical",
      () => ship.x < 0 || ship.x > 7 || ship.y - length < 0 || ship.y > 7
    )
    .exhaustive();
}

function hasKind(list: IShip[], ship: IShip): boolean {
  let count = 0;
  for (let i = 0; i < list.length; i++) {
    const lship = list[i];
    if (lship.kind === ship.kind) {
      count++;
    }
  }
  return match(ship.kind)
    .with("battleship", () => count >= 1)
    .with("cruiser", () => count >= 2)
    .with("sloop", () => count >= 3)
    .otherwise(() => {
      throw new Error("Invalid ship kind");
    });
}

export function asCoordArray(
  rect: IFieldRect
): [TShipAxisCoord, TShipAxisCoord][] {
  const coords: [TShipAxisCoord, TShipAxisCoord][] = [];

  for (let y = rect.y; y < rect.y + rect.h; y++) {
    for (let x = rect.x; x < rect.x + rect.w; x++) {
      coords.push([x as TShipAxisCoord, y as TShipAxisCoord]);
    }
  }

  return coords;
}

export function hasCollisions(list: IShip[], ship: IShip): boolean {
  const collisionZone = getCollisionZone(ship);
  const coords = asCoordArray(collisionZone);
  for (let i = 0; i < coords.length; i++) {
    const coord = coords[i];
    if (getFragKind(list, ...coord) !== "none") {
      return true;
    }
  }
  return false;
}

export function isDestroyed(field: IPlayField, index: number): boolean {
  const body = getBody(field.ships[index]);
  for (let i = 0; i < body.length; i++) {
    const [x, y] = body[i];
    if (field.cells[y][x] !== "×") {
      return false;
    }
  }
  return true;
}

function getBody(ship: IShip): [TShipAxisCoord, TShipAxisCoord][] {
  const length = getShipLength(ship) - 1;

  return match<TShipOrientation, [TShipAxisCoord, TShipAxisCoord][]>(
    ship.orientation
  )
    .with("horisontal", () =>
      range(length).map((i) => [
        (ship.x - length + i) as TShipAxisCoord,
        ship.y,
      ])
    )
    .with("vertical", () =>
      range(length).map((i) => [
        ship.x,
        (ship.y - length + i) as TShipAxisCoord,
      ])
    )
    .exhaustive();
}
