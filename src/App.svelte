<script lang="ts">
  import {
    createGameState,
    doTurn,
    posContainsPawn,
    prepareTurn,
  } from "./game";
  import Spot from "./Spot.svelte";
  let state = createGameState();
  $: possibleTurns = prepareTurn(state);
  $: console.log(state);
  $: console.log(possibleTurns);
</script>

<main>
  {#each state.field.slice().reverse() as row}
    <div class="row">
      {#each row as spot}
        <Spot {spot} pawn={posContainsPawn(state, spot.position)} />
      {/each}
    </div>
  {/each}
  <div>Player: {possibleTurns.player}</div>
  <div>Roll: {state.diceRoll}</div>
  {#each [1, 2, 3, 4, 5] as pawnNbr}
    pawn {pawnNbr}:
    {#each possibleTurns.moves[pawnNbr] as pos}
      <button
        class="row"
        on:click={() => {
          state = doTurn(state, { move: pos, pawnNumber: pawnNbr });
        }}
      >
        x:{pos.x} - y:{pos.y}
      </button>
    {/each}
  {/each}
</main>

<style>
  .row {
    display: flex;
  }
</style>
