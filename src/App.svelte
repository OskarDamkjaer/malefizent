<script lang="ts">
  import Editor from "./Editor.svelte";
  import { posContainsPawn } from "./game";
  import { createGameState, nextTurnOptions, doTurn } from "./gameAPI";
  import { requestTurn } from "./helpers";
  import Spot from "./Spot.svelte";

  import hljs from "highlight.js/lib/core";
  import typescript from "highlight.js/lib/languages/typescript";
  import { onMount } from "svelte";
  import "highlight.js/styles/github.css";

  onMount(() => {
    hljs.registerLanguage("typescript", typescript);
    hljs.highlightAll();
  });
  // kanske ge den fyra bottar och "yielda" varje state?

  let state = createGameState();
  let editor = null;
  // TODO låta folk ha sina egna namn

  // Promise race
  // egen tråd

  // todo start play manually and then later introduce bots
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
      requestTurn("BLUE", nextTurn);
    }
  };

  // Todo: servcie workers
  // TODO prevent people from mutating the state directly... Hmm. JSON
  // stringify handles this nicely I guess. Validation and error handling needed

  // also it needs to look nicer.
  // todo rita en spelplan med nåon hemsidegrej
  // börja med planen
  const startGame = () => {
    requestTurn("BLUE", nextTurnOptions(state));
  };
  /* 
  what we need. 

  # setup
  person submits their code on click. 

  # game 
  we send message with options
  they send message with picked turn
  bots do turns 
  repeat until somone has won
  */
  // Todo store all turns so we can do replay
  // we can keep the "gamestate" thing if we keep the turns instead"
</script>

<main>
  <div id="console" />
  <button on:click={startGame}>start</button>
  <Editor player={"BLUE"} />
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
  <div>Roll: {state.diceRoll}</div>
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
  <!-- <div>Player: {possibleTurns.player}</div>
  pawn {possibleTurns.player}:
  {#each possibleTurns.options as turn}
    <button
      class="row"
      on:click={() => {
        state = doTurn(state, turn);
      }}
    >
      x:{turn.spot.position.x} - y:{turn.spot.position.y}
    </button>
  {/each}
  -->
</main>

<style>
  .row {
    display: flex;
  }
</style>
