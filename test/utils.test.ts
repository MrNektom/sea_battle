import { expect, test } from "vitest";
import { rangeFT } from "../src/store/utils";

test("rangeFT", () => {
  expect(rangeFT(5, 8)).toEqual([5, 6, 7]);
  expect(rangeFT(9, 3)).toEqual([8, 7, 6, 5, 4, 3]);
});
