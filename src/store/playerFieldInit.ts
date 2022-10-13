import { TFieldCell } from "./types";

export function playerFieldInit(): TFieldCell[][] {
  return arr8().map(() => arr8().map(() => " "));
}

function arr8() {
  return Array.from(new Array(8).map(() => 0));
}
