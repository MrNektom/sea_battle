import { createEvent, createStore } from "effector";
import { match } from "ts-pattern";
import { isAllDestroyed, shotField } from "./field";
import { playerFieldInit } from "./playerFieldInit";
import { IGameState, IPlayField, TGamePhase, TShipAxisCoord } from "./types";

export const startGame = createEvent();
export const initPlayer1Field = createEvent<IPlayField>();
export const initPlayer2Field = createEvent<IPlayField>();

export const nextStep = createEvent<[TShipAxisCoord, TShipAxisCoord]>();

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
  phase: "waitForStart",
});

$game.on(startGame, (state) => {
  console.log("start game");
  return {
    ...state,
    phase: "initPlayer1Field",
  };
});

$game.on(initPlayer1Field, (state, field) => ({
  ...state,
  phase: "initPlayer2Field",
  player1: {
    ...state.player1,
    field,
  },
}));

$game.on(initPlayer2Field, (state, field) => ({
  ...state,
  phase: "waitForPlayer1Step",
  player2: {
    ...state.player2,
    field,
  },
}));

$game.on(nextStep, (state, [x, y]) =>
  match<TGamePhase, IGameState>(state.phase)
    .with("waitForPlayer1Step", () => {
      const [field, result] = shotField(state.player2.field, x, y);
      return {
        ...state,
        phase: isAllDestroyed(field)
          ? "showSessionResults"
          : result
          ? "waitForPlayer1Step"
          : "waitForPlayer2Step",
        player2: {
          ...state.player2,
          field,
        },
      };
    })
    .with("waitForPlayer2Step", () => {
      const [field, result] = shotField(state.player1.field, x, y);
      return {
        ...state,
        phase: isAllDestroyed(field)
          ? "showSessionResults"
          : result
          ? "waitForPlayer2Step"
          : "waitForPlayer1Step",
        player1: {
          ...state.player1,
          field,
        },
      };
    })
    .otherwise(() => {
      throw new Error("invalid game state");
    })
);
