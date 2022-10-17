import { createEvent, createStore } from "effector";
import { match } from "ts-pattern";
import { Field } from "./field";
import { IGameState, TGamePhase, TShipAxisCoord } from "./types";

export const startGame = createEvent();
export const initPlayer1Field = createEvent<Field>();
export const initPlayer2Field = createEvent<Field>();

export const nextStep = createEvent<[TShipAxisCoord, TShipAxisCoord]>();

export const $game = createStore<IGameState>({
  player1: {
    field: new Field(),
  },
  player2: {
    field: new Field(),
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
      const [result] = state.player2.field.shot(x, y);

      return {
        ...state,
        phase: state.player2.field.isAllDestroyed()
          ? "showSessionResults"
          : result
          ? "waitForPlayer1Step"
          : "waitForPlayer2Step",
      };
    })
    .with("waitForPlayer2Step", () => {
      const [result] = state.player1.field.shot(x, y);
      return {
        ...state,
        phase: state.player1.field.isAllDestroyed()
          ? "showSessionResults"
          : result
          ? "waitForPlayer2Step"
          : "waitForPlayer1Step",
      };
    })
    .otherwise(() => {
      throw new Error("invalid game state");
    })
);
