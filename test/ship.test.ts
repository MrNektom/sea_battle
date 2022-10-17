import { expect, test } from "vitest";
import { IShip, IFieldRect, TShipAxisCoord } from "../src/store/types";
import {
  asCoordArray,
  getAroundZone,
  getBody,
  getCollisionZone,
  hasCollisions,
  isMiddle,
  isOutOfField,
  isProw,
  isStern,
} from "../src/store/ship";

test("ship matches horisontal", () => {
  const ship: IShip = {
    kind: "cruiser",
    orientation: "horisontal",
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
    kind: "cruiser",
    orientation: "vertical",
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

test("ship collisions", () => {
  const list: IShip[] = [
    {
      kind: "cruiser",
      orientation: "horisontal",
      x: 6,
      y: 1,
    },
  ];
  const ship: IShip = {
    kind: "cruiser",
    orientation: "vertical",
    x: 5,
    y: 3,
  };
  const ship2: IShip = {
    kind: "cruiser",
    orientation: "vertical",
    x: 5,
    y: 5,
  };
  expect(hasCollisions(list, ship)).toBe(true);
  expect(hasCollisions(list, ship2)).toBe(false);
});

test("ship rect", () => {
  const ship1: IShip = {
    kind: "cruiser",
    orientation: "horisontal",
    x: 6,
    y: 1,
  };

  const ship2: IShip = {
    kind: "cruiser",
    orientation: "vertical",
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

test("isOutOfField", () => {
  const ship1: IShip = {
    kind: "cruiser",
    orientation: "horisontal",
    x: 6,
    y: 4,
  };
  const ship2: IShip = {
    kind: "cruiser",
    orientation: "horisontal",
    x: 2,
    y: 0,
  };
  const ship3: IShip = {
    kind: "cruiser",
    orientation: "vertical",
    x: 3,
    y: 1,
  };
  const ship4: IShip = {
    kind: "cruiser",
    orientation: "vertical",
    x: 3,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    y: 8,
  };
  expect(isOutOfField(ship1)).toBe(false);
  expect(isOutOfField(ship2)).toBe(false);
  expect(isOutOfField(ship3)).toBe(true);
  expect(isOutOfField(ship4)).toBe(true);
});

test("as coord array", () => {
  const rect: IFieldRect = {
    x: 2,
    y: 3,
    w: 3,
    h: 2,
  };

  expect(asCoordArray(rect)).toEqual([
    [2, 3],
    [3, 3],
    [4, 3],
    [2, 4],
    [3, 4],
    [4, 4],
  ]);
});

test("get body", () => {
  expect<[TShipAxisCoord, TShipAxisCoord][]>(
    getBody({
      kind: "cruiser",
      orientation: "horisontal",
      x: 3,
      y: 0,
    })
  ).toEqual([
    [1, 0],
    [2, 0],
    [3, 0],
  ]);

  expect<[TShipAxisCoord, TShipAxisCoord][]>(
    getBody({
      kind: "cruiser",
      orientation: "vertical",
      x: 0,
      y: 3,
    })
  ).toEqual([
    [0, 1],
    [0, 2],
    [0, 3],
  ]);
});

test("ship around zone", () => {
  expect(
    getAroundZone({
      kind: "cruiser",
      orientation: "horisontal",
      x: 3,
      y: 1,
    })
  ).toEqual([
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [0, 1],
    [4, 1],
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
    [4, 2],
  ]);

  expect(
    getAroundZone({
      kind: "cruiser",
      orientation: "vertical",
      x: 1,
      y: 3,
    })
  ).toEqual([
    [0, 0],
    [1, 0],
    [2, 0],
    [0, 1],
    [2, 1],
    [0, 2],
    [2, 2],
    [0, 3],
    [2, 3],
    [0, 4],
    [1, 4],
    [2, 4],
  ]);
});
