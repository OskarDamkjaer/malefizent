<script lang="ts">
  import {
    createGameState,
    doTurn,
    posContainsPawn,
    prepareTurn,
    access,
  } from "./game";
  import Spot from "./Spot.svelte";
  let state = createGameState();
  $: possibleTurns = prepareTurn(state);

  $: console.log(state);
  $: console.log(possibleTurns);
  // TODO change so we don't need to flatmap like this. and also give more info on SPOts by default
  // todo make so that people don't need to use
  // TODO byt namn på spelet och designa så den ser fin ut. kanske att ojäserna rör sig?
  const interval = setInterval(() => {
    const moves = [1, 2, 3, 4, 5].flatMap((nbr) =>
      possibleTurns.moves[nbr].map((pos) => ({ pawnNumber: nbr, move: pos }))
    );

    const bestMove = moves.sort((a, b) => {
      return (
        access(state.field, a.move).goalDistance -
        access(state.field, b.move).goalDistance
      );
    });

    const random = moves[Math.floor(Math.random() * moves.length)];

    if (possibleTurns.player === "BLUE") {
      state = doTurn(state, bestMove[0]);
    } else {
      state = doTurn(state, random[0]);
    }
    if (state.winner) {
      clearInterval(interval);
    }
  }, 100);
</script>

<main>
  {#each state.field.slice().reverse() as row}
    <div class="row">
      {#each row as spot}
        <Spot {spot} pawn={posContainsPawn(state, spot.position)} />
      {/each}
    </div>
  {/each}
  {#if state.winner}
    <div>WINNER: {state.winner}</div>
  {/if}
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
