import { Field } from "./field";

export interface IGameState {
  player1: IPlayer;
  player2: IPlayer;
  phase: TGamePhase;
}

export interface IPlayer {
  field: Field;
}

export interface IPlayField {
  cells: TFieldCell[][];
  ships: IShip[];
}

export type TFieldCell = " " | "・" | "\u{00d7}";

export type TGamePhase =
  | "waitForStart"
  | "initPlayer1Field"
  | "initPlayer2Field"
  | "waitForPlayer1Step"
  | "waitForPlayer2Step"
  | "showSessionResults";

export type TShipOrientation = "vertical" | "horisontal";

export type TShipKind = "sloop" | "cruiser" | "battleship";

export type TShipAxisCoord = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface IShip {
  orientation: TShipOrientation;
  kind: TShipKind;
  x: TShipAxisCoord;
  y: TShipAxisCoord;
}

export type TShipFragment =
  | "middleV"
  | "middleH"
  | "prowR"
  | "prowB"
  | "sternT"
  | "sternL"
  | "none";

export interface IFieldRect {
  x: number;
  y: number;
  w: number;
  h: number;
}
