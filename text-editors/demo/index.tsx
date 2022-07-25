import { parse } from "papaparse";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { basicBot, killerBot, playerStarter, randomBot } from "./builtinBots";
import { CodeEditor } from "./code-editor";
import { currentPlayer, posContainsPawn } from "./game";
import { createGameState, doTurn, nextTurnOptions } from "./gameAPI";
import { requestTurn } from "./helpers";
import "./input.css";
// @ts-ignore
import mal from "./plan.jpg";
import { SpotView } from "./spot";

export type SpreadsheetEntry = {
  "Author name": string;
  "Bot Image link": string | null;
  "Bot name": string;
  Code: string;
  Vetted: boolean | null;
};

export const nameRow = (e: SpreadsheetEntry) =>
  `${e["Author name"]}s - ${e["Bot name"]}`;

function App() {
  const [bots, setBots] = useState<Record<string, SpreadsheetEntry>>({});
  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSqUDr_aXWAzwkjCB1N2lH5xanLTGpAhSMt3fYHdkLUP2On1Tkrkb8HFCSqrGCjXZYocNne_qOZwdbU/pub?gid=359820102&single=true&output=csv"
    )
      .then(res => res.text())
      .then(data => {
        const parsed = parse(data, { header: true, dynamicTyping: true })
          .data as SpreadsheetEntry[];

        setBots(
          parsed
            // only vet later
            // .filter(b => b.Vetted)
            .reduce((acc, curr) => {
              // Deduplicates by name & author
              return { ...acc, [nameRow(curr)]: curr };
            }, {})
        );
      });
  }, []);
  const [state, setState] = useState(createGameState());

  window.onmessage = async ({ data }) => {
    //console.log("winmess", data);
    let turn: any = null;
    try {
      turn = JSON.parse(data);
    } catch {}

    //await new Promise(res => setTimeout(res, 20));
    const newState = doTurn(state, turn);
    setState(newState);

    if (newState.winner) {
      console.log(newState.winner + " won");
    } else {
      const nextTurn = nextTurnOptions(newState);
      requestTurn(currentPlayer(newState), nextTurn);
    }
  };

  const startGame = () => {
    const restartedState = createGameState();
    setState(restartedState);
    requestTurn(currentPlayer(restartedState), nextTurnOptions(restartedState));
  };
  return (
    <main className="flex gap-1">
      <div className="min-w-[680px]">
        <img src={mal} />
        {state.field
          .slice()
          .reverse()
          .map(row => (
            <div className="absolute top-0" key={row[0].position.y}>
              {row.map(spot => (
                <span
                  className="absolute"
                  key={
                    spot.position.x.toString() +
                    ":" +
                    spot.position.y.toString()
                  }
                  style={{
                    left: `${spot.position.x * 38 + 21}px`,
                    top: `${515 - spot.position.y * 38}px`,
                  }}
                >
                  <SpotView
                    spot={spot}
                    pawn={posContainsPawn(state, spot.position)}
                  />
                </span>
              ))}
            </div>
          ))}
        <div className="max-w-[680px] w-[680px] p-2">
          <h1 className="text-xl font-bold"> Rules! </h1>
          <p className="mb-2">
            Malefiz is a race to the goal spot on the top. On each players turn
            they roll a 6 sided die and move any of their 5 five pawns as many
            spaces as show on the die.
          </p>
          <p className="mb-2">
            If you land on another players pawn, it's captured and sent back to
            it's starting postion.{" "}
          </p>
          <p>
            You are allowed to pass pawns, but not the "Barricades" (white spots
            on the map). If you do capture a barricade, you have to move it to
            an unoccupied spot on the map (it can't be put on the bottom row).
          </p>
          <p className="mb-2"></p>
        </div>
      </div>
      <span className="grow">
        <span className="flex gap-1 mt-1">
          <button
            className="bg-lime-600 hover:bg-lime-800 text-white px-1 rounded"
            onClick={startGame}
          >
            {state.turn > 0 && "re"}start game
          </button>
          <span className=""> turn: {state.turn}</span>
          {state.winner && (
            <span>
              -
              {state.winner === "BLUE"
                ? " You (blue) win!"
                : ` You lost, ${state.winner} won.`}
            </span>
          )}
        </span>
        <CodeEditor
          player="BLUE"
          defaultExpand
          startingBot={playerStarter}
          userBots={bots}
          main
        />
        <h2 className="text-lg font-bold mt-1"> Other Bots </h2>
        <CodeEditor userBots={bots} player="RED" startingBot={basicBot} />
        <CodeEditor userBots={bots} player="YELLOW" startingBot={killerBot} />
        <CodeEditor userBots={bots} player="GREEN" startingBot={randomBot} />
      </span>
    </main>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
