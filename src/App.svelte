<script lang="ts">
  import { GameAPI } from "./gameAPI";
  import type { BotSet } from "./game";
  import Spot from "./Spot.svelte";
  import { RandomBot } from "./DefaultBots";
  // kanske ge den fyra bottar och "yielda" varje state?

  const game = new GameAPI();
  let nextTurn = game.nextTurnOptions();
  const bots: BotSet = [RandomBot, RandomBot, RandomBot, RandomBot];

  // Promise race
  // egen tråd
  const interval = setInterval(() => {
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

  // Show type of Pawn, Position, Spot, Turn
  let code = `
  // You have the following variables available:
  // 
  //   canHavebarricade: Spot[];
  //   hasBarricade: Spot[];
  //   myPawns: Pawn[];
  //   otherPawns: Pawn[];
  //   allSpots: Spot[];
  //   moves: Turn[];
  // 
  // And you'll need to return a value of type Turn
  // type Turn = {
  //   pawn: Pawn;
  //   spot: Spot;
  //   newBarricadePosition?: Position; 
  // };
  // 
  // On an invalid or missing turn, a random turn is
  // chosen automatically
  // 

  console.log(moveOptions[0])
  console.log(moveOptions[0])
  console.log(12)
  console.log(2)
  return moveOptions[0]
  `;

  $: runnable = eval(`() => {
    document.getElementById("console").innerHTML = "";
    console.log = (m) => document.getElementById("console").innerHTML += JSON.stringify(m)+ "<br>";
    const moves = ${JSON.stringify(nextTurn.moves)};
    const moves = ${JSON.stringify(nextTurn.moves)};
    const moves = ${JSON.stringify(nextTurn.moves)};
    const myPawns = ${JSON.stringify(nextTurn.myPawns)};
    const otherPawns = ${JSON.stringify(nextTurn.otherPawns)};
    const allSpots = ${JSON.stringify(nextTurn.allSpots)};
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
