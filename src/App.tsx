import { useEvent, useStore } from "effector-react";
import "./App.css";
import { InitFieldScreen } from "./screens/InitFieldScreen/InitFieldScreen";
import { $game, startGame } from "./store/store";
import { EGamePhase } from "./store/types";

function App() {
  const game = useStore($game);

  const startEvent = useEvent(startGame);
  return (
    <div className="App">
      {game.phase === EGamePhase.waitForStart && (
        <button onClick={() => startEvent()}>Start Game</button>
      )}
      {(game.phase === EGamePhase.initPlayer1Field ||
        game.phase === EGamePhase.initPlayer2Field) && <InitFieldScreen />}
    </div>
  );
}

export default App;
