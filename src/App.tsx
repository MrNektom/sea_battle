import { useEvent, useStore } from "effector-react";
import React from "react";
import "./App.css";
import { GameScreen } from "./screens/GameScreen/GameScreen";
import { InitFieldScreen } from "./screens/InitFieldScreen/InitFieldScreen";
import { ResultsScreen } from "./screens/ResultsScreen/ResultsScreen";
import { $game, startGame } from "./store/store";
function App() {
  const game = useStore($game);

  const startEvent = useEvent(startGame);
  return (
    <div className="App">
      {game.phase === "waitForStart" && (
        <button onClick={() => startEvent()}>Start Game</button>
      )}
      {(game.phase === "initPlayer1Field" ||
        game.phase === "initPlayer2Field") && <InitFieldScreen />}
      {(game.phase === "waitForPlayer1Step" ||
        game.phase === "waitForPlayer2Step") && <GameScreen />}
      {game.phase === "showSessionResults" && <ResultsScreen />}
    </div>
  );
}

export default App;
