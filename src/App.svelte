<script lang="ts">
  import { GameAPI } from "./gameAPI";
  import type { BotSet } from "./game";
  import Spot from "./Spot.svelte";
  import { RandomBot } from "./DefaultBots";

  // kanske ge den fyra bottar och "yielda" varje state?

  const game = new GameAPI();
  let nextTurn = game.nextTurnOptions();
  const bots: BotSet = [RandomBot, RandomBot, RandomBot, RandomBot];
  // det får bli en sandboxad iframe

  // Promise race
  // egen tråd
  /*
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
  */

  const code2 = "application.remote.alert('Hello from the plugin!');";

  const api = {
    alert: alert,
  };
  //console.log(jailed);
  //const plugin = new jailed.DynamicPlugin(code2, api);

  // Show type of Pawn, Position, Spot, Turn
  let code = `
  // You have the following variables available:
  // 
  // moves: Turn[];
  // myPawns: Pawn[];
  // otherPawns: Pawn[];
  // canHavebarricade: Spot[];
  // hasBarricade: Spot[];
  // allSpots: Spot[];
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
    const myPawns = ${JSON.stringify(nextTurn.myPawns)};
    const otherPawns = ${JSON.stringify(nextTurn.otherPawns)};
    const allSpots = ${JSON.stringify(nextTurn.allSpots)};
  ${code}
}`);
  function executeSafely(code: string) {
    const doc = document.getElementById("codeframe");
    if (doc instanceof HTMLIFrameElement) {
      const iframe = doc.contentDocument;
      if (iframe) {
        iframe.open();
        iframe.write(
          `<script>${code}</script` + ">" /*svelte compiler workaround*/
        );
        iframe.close();
      }
    }
  }
  function sendMessage(msg: string) {
    const doc = document.getElementById("codeframe");
    if (doc instanceof HTMLIFrameElement) {
      doc.contentWindow.postMessage(msg);
    }
  }

  setTimeout(() => {
    executeSafely(
      "console.log('hej');window.onmessage=(({data}) => console.log(data))"
    );
    sendMessage("jaman");
  }, 1000);
</script>

<main>
  <textarea bind:value={code} />
  <div id="console" />
  <button on:click={runnable}> RUN </button>
  <iframe title="codeframe" id="codeframe" src="about:blank" />
  <!-- // sandbox="allow-scripts" -->
  <!--
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
  <div>Roll: {state.diceRoll}</div>
  -->
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
