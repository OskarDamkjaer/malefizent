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
  import { playerStarter } from "./builtinBots";

  onMount(() => {
    hljs.registerLanguage("typescript", typescript);
    hljs.highlightAll();
  });

  let state = createGameState();

  window.onmessage = ({ data }) => {
    const turn = JSON.parse(data);
    state = doTurn(state, turn);

    if (state.winner) {
      console.log(state.winner);
    } else {
      const nextTurn = nextTurnOptions(state);
      requestTurn(currentPlayer(state), nextTurn);
    }
  };

  // TODO debugging mode
  // TODO sandbox
  // TODO mock console log & error
  // TODO all kinds of errors handling . json parse can throw
  // TODO restart without refresh
  // TODO save to localstorage on cmd+s
  // TODO låta folk ha sina egna namn
  // TODO play manually
  // TODO: servcie workers
  // TODO: enforce max time
  // TODO: game reporting events
  // also it needs to look nicer.
  const startGame = () => {
    state = createGameState();
    requestTurn(currentPlayer(state), nextTurnOptions(state));
  };
</script>

<main>
  <div>turn number: {state.turn}</div>
  <button on:click={startGame}>start</button>
  <Editor player="BLUE" expand startingBot={playerStarter} />
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
export type PossibleTurn = {
  canHavebarricade: Spot[];
  hasBarricade: Spot[];
  myPawns: Pawn[];
  otherPawns: Pawn[];
  allSpots: Spot[];
  moves: Turn[];
};

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
