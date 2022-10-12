import { match } from "ts-pattern";
import {
  EShipFragment,
  EShipKind,
  EShipOrientation,
  IFieldRect,
  IPlayField,
  IShip,
  TShipAxisCoord,
} from "./types";
import { rangeFT } from "./utils";

export function getFragKind(
  field: IPlayField,
  x: TShipAxisCoord,
  y: TShipAxisCoord
): EShipFragment | null {
  return match<IShip | null, EShipFragment | null>(findShip(field, x, y))
    .with(
      {},
      (ship) => isProw(ship, x, y),
      (ship) =>
        match(ship.orientation)
          .with(EShipOrientation.Horisontal, () => EShipFragment.prowToR)
          .with(EShipOrientation.Vertical, () => EShipFragment.prowToB)
          .otherwise(() => EShipFragment.none)
    )
    .with(
      {},
      (ship) => isMiddle(ship, x, y),
      (ship) =>
        match(ship.orientation)
          .with(
            EShipOrientation.Horisontal,
            () => EShipFragment.middleHorisontal
          )
          .with(EShipOrientation.Vertical, () => EShipFragment.middleVertical)
          .otherwise(() => EShipFragment.none)
    )
    .with(
      {},
      (ship) => isStern(ship, x, y),
      (ship) =>
        match(ship.orientation)
          .with(EShipOrientation.Horisontal, () => EShipFragment.sternFromL)
          .with(EShipOrientation.Vertical, () => EShipFragment.sternFromT)
          .otherwise(() => EShipFragment.none)
    )
    .otherwise(() => null);
}

function findShip(
  field: IPlayField,
  x: TShipAxisCoord,
  y: TShipAxisCoord
): IShip | null {
  for (let i = 0; i < field.ships.length; i++) {
    const ship = field.ships[i];
    if (hasShipOnCoords(ship, x, y)) {
      return ship;
    }
  }
  return null;
}

function getShipLength(ship: IShip): number {
  return match<EShipKind, number>(ship.kind)
    .with(EShipKind.Sloop, () => 2)
    .with(EShipKind.Cruiser, () => 3)
    .with(EShipKind.Battleship, () => 4)
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
      { orientation: EShipOrientation.Horisontal, y },
      () => ship.x > x && ship.x - (length - 1) < x
    )
    .with(
      { orientation: EShipOrientation.Vertical, x },
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
    .with(
      { orientation: EShipOrientation.Horisontal, y },
      () => ship.x - (length - 1) === x
    )
    .with(
      { orientation: EShipOrientation.Vertical, x },
      () => ship.y - (length - 1) === y
    )
    .otherwise(() => false);
}

export function generateShips(): IShip[] {
  let ship: IShip | null = null;
  const list: IShip[] = [];
  while (hasAdd(list)) {
    ship = genShip();
    if (hasCollisions(list, ship)) {
      continue;
    }
    list.push(ship);
  }
  return list;
}

function genAxisCoord(): TShipAxisCoord {
  return Math.round(Math.random() * 8) as TShipAxisCoord;
}

function genOrientation(): EShipOrientation {
  return Math.round(Math.random());
}

function genShipKind(): EShipKind {
  return Math.round(Math.random() * 2);
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
    if (ship.kind === EShipKind.Sloop) {
      sloop++;
    }
    if (ship.kind === EShipKind.Cruiser) {
      cruiser++;
    }
    if (ship.kind === EShipKind.Battleship) {
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
    .with(EShipOrientation.Horisontal, () => ship.x - length)
    .otherwise(() => ship.x - 1);
  const x2 = ship.x + 1;
  const y1 = match(ship.orientation)
    .with(EShipOrientation.Horisontal, () => ship.y - 1)
    .otherwise(() => ship.y - length);
  const y2 = ship.y + 1;
  return {
    x: x1,
    y: y1,
    w: x2 - x1 + 1,
    h: y2 - y1 + 1,
  };
}

export function getBodyZone(ship: IShip): IFieldRect {
  const length = getShipLength(ship);
  return match<EShipOrientation, IFieldRect>(ship.orientation)
    .with(EShipOrientation.Horisontal, () => ({
      x: ship.x - length,
      y: ship.y,
      w: length,
      h: 1,
    }))
    .with(EShipOrientation.Vertical, () => ({
      x: ship.x,
      y: ship.y - length,
      w: 1,
      h: length,
    }))
    .otherwise(() => {
      throw new Error("Unexpected branch");
    });
}

function hasPointInRect(rect: IFieldRect, x: number, y: number): boolean {
  return (
    rect.x <= x && rect.x + rect.w >= y && rect.y <= y && rect.y + rect.h >= y
  );
}

export function detectCollisions(
  rect1: IFieldRect,
  rect2: IFieldRect
): boolean {
  return (
    hasPointInRect(rect1, rect2.x, rect2.y) ||
    hasPointInRect(rect1, rect2.x, rect2.y + rect2.h) ||
    hasPointInRect(rect1, rect2.x + rect2.w, rect2.y + rect2.h) ||
    hasPointInRect(rect1, rect2.x + rect2.w, rect2.y)
  );
}

function isOutOfField(ship: IShip): boolean {
  const body = getBodyZone(ship);
  const fieldRect: IFieldRect = {
    x: 0,
    y: 0,
    w: 8,
    h: 8,
  };

  return (
    !hasPointInRect(fieldRect, body.x, body.y) &&
    !hasPointInRect(fieldRect, body.x + body.w - 1, body.y + body.h - 1)
  );
}

export function hasCollisions(list: IShip[], ship: IShip): boolean {
  const newCollisionZone = getCollisionZone(ship);
  for (let i = 0; i < list.length; i++) {
    const collisionZone = getBodyZone(list[i]);
    if (
      isOutOfField(ship) ||
      detectCollisions(newCollisionZone, collisionZone)
    ) {
      return true;
    }
  }
  return false;
}
