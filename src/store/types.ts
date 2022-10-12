export interface IGameState {
  player1: IPlayer;
  player2: IPlayer;
  phase: EGamePhase;
}

export interface IPlayer {
  field: IPlayField;
}

export interface IPlayField {
  cells: EFieldCell[][];
  ships: IShip[];
}

export enum EFieldCell {
  none = "",
  past = "・",
  hit = "\u{00d7}",
}

export enum EGamePhase {
  waitForStart,
  initPlayer1Field,
  waitForPlayer2,
  initPlayer2Field,
  waitForPlayer1Step,
  waitForPlayer2Step,
  showSessionResults,
}

export enum EShipOrientation {
  Vertical,
  Horisontal,
}

export enum EShipKind {
  Sloop = 0,
  Cruiser = 1,
  Battleship = 2,
}

export type TShipAxisCoord = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface IShip {
  orientation: EShipOrientation;
  kind: EShipKind;
  x: TShipAxisCoord;
  y: TShipAxisCoord;
}

export enum EShipFragment {
  middleVertical = "middleV",
  middleHorisontal = "middleH",
  prowToR = "prowR",
  prowToB = "prowB",
  sternFromT = "sternT",
  sternFromL = "sternL",
  none = "none",
}

export interface IFieldRect {
  x: number;
  y: number;
  w: number;
  h: number;
}
