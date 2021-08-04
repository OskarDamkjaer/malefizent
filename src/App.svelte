<script lang="ts">
  import {
    createGameState,
    doTurn,
    posContainsPawn,
    getNextTurnOptions,
  } from "./game";

  import Spot from "./Spot.svelte";
  let state = createGameState();
  $: possibleTurns = getNextTurnOptions(state);

  $: console.log(state);
  $: console.log(possibleTurns);
  const interval = setInterval(() => {
    const moves = possibleTurns.options;
    const bestMove = moves.sort(
      (a, b) => a.spot.goalDistance - b.spot.goalDistance
    )[0];

    const random = moves[Math.floor(Math.random() * moves.length)];

    if (possibleTurns.player === "BLUE") {
      state = doTurn(state, bestMove);
    } else {
      state = doTurn(state, random);
    }
    if (state.winner) {
      clearInterval(interval);
    }
  }, 100);
  clearInterval(interval);
  let code = `
  // write your bot here. you have access to a global variable called moveOptions
  // it contains possible turns you could do
  // and access to a 
  console.log(moveOptions[0])
  console.log(moveOptions[0])
  console.log(12)
  console.log(2)
  return moveOptions[0]
  `;

  $: runnable = eval(`() => {
    document.getElementById("console").innerHTML = "";
    console.log = (m) => document.getElementById("console").innerHTML += JSON.stringify(m)+ "<br>";
    const moveOptions = ${JSON.stringify(possibleTurns.options)};
  ${code}
}`);
</script>

<main>
  <textarea bind:value={code} />
  <div id="console" />
  <button on:click={runnable}> RUN </button>
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
</main>

<style>
  .row {
    display: flex;
  }
</style>
