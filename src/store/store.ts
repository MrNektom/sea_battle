import { createEvent, createStore } from "effector";
import { playerFieldInit } from "./playerFieldInit";
import { EGamePhase, IGameState } from "./types";

export const startGame = createEvent();
export const initPlayer1Field = createEvent();
export const initPlayer2Field = createEvent();

export const nextStep = createEvent();

export const $game = createStore<IGameState>({
  player1: {
    field: {
      cells: playerFieldInit(),
      ships: [],
    },
  },
  player2: {
    field: {
      cells: playerFieldInit(),
      ships: [],
    },
  },
  phase: EGamePhase.waitForStart,
});

$game.on(startGame, (state) => {
  console.log("start game");
  return {
    ...state,
    phase: EGamePhase.initPlayer1Field,
  };
});
