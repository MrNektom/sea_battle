import { expect, test } from "vitest";
import {
  IShip,
  EShipKind,
  EShipOrientation,
  IPlayField,
  IFieldRect,
} from "../src/store/types";
import {
  detectCollisions,
  getBodyZone,
  getCollisionZone,
  hasCollisions,
  isMiddle,
  isProw,
  isStern,
} from "../src/store/ship";
import { playerFieldInit } from "../src/store/playerFieldInit";

test("ship matches horisontal", () => {
  const ship: IShip = {
    kind: EShipKind.Cruiser,
    orientation: EShipOrientation.Horisontal,
    x: 3,
    y: 1,
  };

  // prow
  expect(isProw(ship, 3, 1)).toBe(true);

  // middle
  expect(isProw(ship, 2, 1)).toBe(false);

  // prow
  expect(isMiddle(ship, 3, 1)).toBe(false);

  // middle
  expect(isMiddle(ship, 2, 1)).toBe(true);

  // stern
  expect(isMiddle(ship, 1, 1)).toBe(false);

  // stern
  expect(isStern(ship, 1, 1)).toBe(true);

  // none
  expect(isStern(ship, 0, 0)).toBe(false);
  expect(isMiddle(ship, 0, 0)).toBe(false);
});

test("ship matches vertical", () => {
  const ship: IShip = {
    kind: EShipKind.Cruiser,
    orientation: EShipOrientation.Vertical,
    x: 3,
    y: 3,
  };

  // prow
  expect(isProw(ship, 3, 3)).toBe(true);

  // middle
  expect(isProw(ship, 3, 2)).toBe(false);

  // prow
  expect(isMiddle(ship, 3, 3)).toBe(false);

  // middle
  expect(isMiddle(ship, 3, 2)).toBe(true);

  // stern
  expect(isMiddle(ship, 3, 1)).toBe(false);

  // stern
  expect(isStern(ship, 3, 1)).toBe(true);

  // none
  expect(isStern(ship, 3, 0)).toBe(false);
  expect(isMiddle(ship, 0, 0)).toBe(false);
});

test("ship body zone", () => {
  expect(
    getBodyZone({
      kind: EShipKind.Cruiser,
      orientation: EShipOrientation.Horisontal,
      x: 4,
      y: 2,
    })
  ).toEqual({
    x: 1,
    y: 2,
    w: 3,
    h: 1,
  });

  expect(
    getBodyZone({
      kind: EShipKind.Cruiser,
      orientation: EShipOrientation.Vertical,
      x: 2,
      y: 4,
    })
  ).toEqual({
    x: 2,
    y: 1,
    w: 1,
    h: 3,
  });
});

test("rect collisions", () => {
  expect(
    detectCollisions(
      {
        x: 1,
        y: 1,
        w: 2,
        h: 2,
      },
      {
        x: 2,
        y: 2,
        w: 3,
        h: 3,
      }
    )
  ).toBe(true);

  expect(
    detectCollisions(
      {
        x: 2,
        y: 2,
        w: 2,
        h: 2,
      },
      {
        x: 1,
        y: 1,
        w: 2,
        h: 2,
      }
    )
  ).toBe(true);
  expect(
    detectCollisions(
      {
        x: 1,
        y: 1,
        w: 2,
        h: 2,
      },
      {
        x: 1,
        y: 3,
        w: 2,
        h: 2,
      }
    )
  ).toBe(true);
  expect(
    detectCollisions(
      {
        x: 1,
        y: 1,
        w: 2,
        h: 2,
      },
      {
        x: 2,
        y: 2,
        w: 3,
        h: 3,
      }
    )
  ).toBe(true);
});

test("ship collisions", () => {
  const list: IShip[] = [
    {
      kind: EShipKind.Cruiser,
      orientation: EShipOrientation.Horisontal,
      x: 6,
      y: 1,
    },
  ];
  const ship: IShip = {
    kind: EShipKind.Cruiser,
    orientation: EShipOrientation.Vertical,
    x: 5,
    y: 3,
  };
  const ship2: IShip = {
    kind: EShipKind.Cruiser,
    orientation: EShipOrientation.Vertical,
    x: 5,
    y: 5,
  };
  expect(hasCollisions(list, ship)).toBe(true);
  expect(hasCollisions(list, ship2)).toBe(false);
});

test("ship rect", () => {
  const ship1: IShip = {
    kind: EShipKind.Cruiser,
    orientation: EShipOrientation.Horisontal,
    x: 6,
    y: 1,
  };

  const ship2: IShip = {
    kind: EShipKind.Cruiser,
    orientation: EShipOrientation.Vertical,
    x: 5,
    y: 3,
  };

  expect(getCollisionZone(ship1)).toEqual<IFieldRect>({
    x: 3,
    y: 0,
    w: 5,
    h: 3,
  });

  expect(getCollisionZone(ship2)).toEqual<IFieldRect>({
    x: 4,
    y: 0,
    w: 3,
    h: 5,
  });
});
