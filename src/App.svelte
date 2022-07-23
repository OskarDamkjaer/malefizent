<script lang="ts">
  import Editor from "./Editor.svelte";
  import { currentPlayer, posContainsPawn } from "./game";
  import { createGameState, nextTurnOptions, doTurn } from "./gameAPI";
  import { requestTurn } from "./helpers";
  import Spot from "./Spot.svelte";
  import { playerStarter } from "./builtinBots";

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
  <h1>Malefiz</h1>
  {#each state.field.slice().reverse() as row}
    <div class="row">
      {#each row as spot}
        <Spot {spot} pawn={posContainsPawn(state, spot.position)} />
      {/each}
    </div>
  {/each}
  <div>turn number: {state.turn}</div>
  <button on:click={startGame}>start</button>
  <Editor player="BLUE" expand startingBot={playerStarter} />
  <Editor player="RED" />
  <Editor player="YELLOW" />
  <Editor player="GREEN" />
  {#if state.winner}
    {#if state.winner === "BLUE"}
      <div>You (blue) win!</div>
    {:else}
      <div>You lost. {state.winner} won.</div>
    {/if}
  {/if}
</main>

<style>
  .row {
    display: flex;
  }
</style>
