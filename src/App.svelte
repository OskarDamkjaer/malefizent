<script lang="ts">
  import Editor from "./Editor.svelte";
  import { currentPlayer, posContainsPawn } from "./game";
  import { createGameState, nextTurnOptions, doTurn } from "./gameAPI";
  import { requestTurn } from "./helpers";
  import Spot from "./Spot.svelte";

  import hljs from "highlight.js/lib/core";
  import typescript from "highlight.js/lib/languages/typescript";
  import { onMount } from "svelte";
  import "highlight.js/styles/github.css";
  import { playerStarterSource } from "./DefaultBots";

  onMount(() => {
    hljs.registerLanguage("typescript", typescript);
    hljs.highlightAll();
  });

  let state = createGameState();
  // TODO låta folk ha sina egna namn

  // Promise race
  // egen tråd

  // Show type of Pawn, Position, Spot, Turn

  window.onmessage = ({ data }) => {
    // todo all kinds of errors handling . json parse can throw
    const turn = JSON.parse(data);
    //console.log("turn", turn);
    state = doTurn(state, turn);

    if (state.winner) {
      console.log(state.winner);
    } else {
      const nextTurn = nextTurnOptions(state);
      requestTurn(currentPlayer(state), nextTurn);
    }
  };

  // TODO play manually
  // Todo: servcie workers
  // TODO prevent people from mutating the state directly... Hmm. JSON
  // stringify handles this nicely I guess. Validation and error handling needed

  // also it needs to look nicer.
  // todo rita en spelplan med nåon hemsidegrej
  // börja med planen
  const startGame = () => {
    requestTurn(currentPlayer(state), nextTurnOptions(state));
  };
</script>

<main>
  <div>turn number: {state.turn}</div>
  <button on:click={startGame}>start</button>
  <Editor player="BLUE" expand startCode={playerStarterSource} />
  <Editor player="RED" />
  <Editor player="YELLOW" />
  <Editor player="GREEN" />
  {#each state.field.slice().reverse() as row}
    <div class="row">
      {#each row as spot}
        <Spot {spot} pawn={posContainsPawn(state, spot.position)} />
      {/each}
    </div>
  {/each}
  {#if state.winner}
    {#if state.winner === "BLUE"}
      <div>You (blue) win!</div>
    {:else}
      <div>You lost. {state.winner} won.</div>
    {/if}
  {/if}
  <pre><code> 
    {`
type Turn = {
  pawn: Pawn;
  spot: Spot;
newBarricadePosition?: Position;
};
  
type Pawn = {
  color: Color;
  number: number;
  position: Position | null; // if not on board is missing
  name?: string; // for later
};
 
type Color = "BLUE" | "RED" | "YELLOW" | "GREEN";
  
type Spot = {
  contains: "OUTSIDE" | "NORMAL" | "BARRICADE" | "GOAL";
  startingPointColor?: Color;
  connectedTo: Position[];
  unBarricadeable?: boolean;
  goalDistance?: number;
  position: Position;
};

type Position = { x: number; y: number }; `}
  </code></pre>
</main>

<style>
  .row {
    display: flex;
  }
</style>
