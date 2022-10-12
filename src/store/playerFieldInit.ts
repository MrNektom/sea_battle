import { EFieldCell } from "./types";

export function playerFieldInit() {
  return arr8().map(() => arr8().map(() => EFieldCell.none));
}

function arr8() {
  return Array.from(new Array(8).map(() => 0));
}
