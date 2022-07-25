import React, { useEffect, useReducer, useState } from "react";
import { transpile } from "typescript";
import { SpreadsheetEntry } from ".";
import { Editor } from "../src/lib";
import { pickableBots, playerStarter, randomBot } from "./builtinBots";
import type { Color } from "./game";
import { loadPlayerCode, playerConstants } from "./helpers";
type Bot = { name: string; author: string; code: string };
type Props = {
  player: Color;
  startingBot?: Bot;
  defaultExpand?: boolean;
  main?: boolean;
  userBots: Record<string, SpreadsheetEntry>;
};

export const CodeEditor = ({
  player,
  defaultExpand = false,
  startingBot = randomBot,
  main = false,
  userBots,
}: Props) => {
  const [code, setCode] = useState(
    main ? playerStarter.code : startingBot.code
  );
  const [expanded, toggleExpanded] = useReducer(e => !e, defaultExpand);
  const [openSubmit, toggleSubmit] = useReducer(e => !e, false);
  const [selected, setSel] = useState(startingBot.name);

  const botNames = pickableBots.map(b => b.name).concat(Object.keys(userBots));

  const loadCode = () =>
    loadPlayerCode(
      player,
      `
${transpile(code)}
window.onmessage=(({data}) => {
  const move = doTurn(JSON.parse(data))
  window.top.postMessage(JSON.stringify(move))
})`
    );

  useEffect(loadCode, [code]);

  const handleSubmit: React.ChangeEventHandler<HTMLSelectElement> = e => {
    const chosen = e.target.value;
    setSel(chosen);
    const isUserBot = chosen.includes("-");

    setCode(
      isUserBot
        ? userBots[chosen].Code
        : pickableBots.find(b => b.name === chosen).code
    );
  };

  return (
    <div className="mb-2">
      {main && openSubmit && (
        <iframe
          src={`https://docs.google.com/forms/d/e/1FAIpQLSd-vaTSkYAZxw9vsDLcrDZzzy6Ji7Ys9BTsVCz9vHE2QBorJw/viewform?usp=pp_url&entry.1402855361=${encodeURIComponent(
            selected
          )}&entry.665471973=${encodeURIComponent(code)}&embedded=true`}
          width="640"
          height="366"
          frameBorder="0"
        >
          Loading…
        </iframe>
      )}
      <iframe
        title="codeframe"
        id={playerConstants[player].iframeId}
        src="about:blank"
        /* sandbox="allow-scripts" */
        style={{ display: "none" }}
      />
      <span className="flex mb-1 gap-1">
        <div>
          {player[0] + player.slice(1).toLowerCase()} {main && "(you)"}
        </div>
        {main ? (
          <input
            value={selected}
            onChange={s => setSel(s.target.value)}
            className="w-48"
          />
        ) : (
          <select value={selected} onChange={handleSubmit}>
            {botNames.map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        )}
        {main && (
          <button
            onClick={toggleSubmit}
            className="bg-blue-500 hover:bg-blue-800 text-white px-1 rounded"
          >
            {openSubmit ? "hide form" : "submit bot to tournament "}
          </button>
        )}
        <button onClick={toggleExpanded}>
          {expanded ? "hide code " : "show code "}
        </button>
      </span>
      {expanded && (
        <div className="min-h-[600px] h-[600px]">
          <span id={playerConstants[player].editorId} />
          <Editor lang="ts" value={code} onChange={setCode} />
        </div>
      )}
    </div>
  );
};
