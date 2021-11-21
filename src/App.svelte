<script lang="ts">
  import { GameAPI } from "./gameAPI";
  // kanske ge den fyra bottar och "yielda" varje state?

  const game = new GameAPI();
  let nextTurn = game.nextTurnOptions();

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

  // todo start play manually and then later introduce bots
  // Show type of Pawn, Position, Spot, Turn
  let code = `/* Your job is to create a function called "doTurn" that takes 
the following parameters:
 turnOptions: Turn[];
 myPawns: Pawn[];
 otherPawns: Pawn[];
 canHavebarricade: Spot[];
 hasBarricade: Spot[];
 allSpots: Spot[];

 And you need to return one of the turnOptions. If turn chosen turn
 is invalid or your function took longer than 200ms to return, a random
 turn is chosen instead. see the types at bottom (TODO at side is better)
 */ 

 function doTurn(turnOptions, myPawns, otherPawns, canHaveBarricade, allSpots) {
  console.log(turnOptions[0])
  const randomMove = turnOptions[Math.floor(Math.random() * turnOptions.length)]
  return randomMove;
}

/* Type reference 
 Where the types are: 
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

 type Position = { x: number; y: number };
 */
`;

  //document.getElementById("console").innerHTML = "";
  //console.log = (m) => document.getElementById("console").innerHTML += JSON.stringify(m)+ "<br>";
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

  window.onmessage = ({ data }) => {
    // todo all kinds of errors handling . json parse can throw
    const turn = JSON.parse(data);
    console.log("turn", turn);
    let nextTurn = game.doTurn(turn);
    console.log(nextTurn);

    if (game.state.winner) {
      console.log(game.state.winner);
    } else {
      sendMessage(JSON.stringify(nextTurn));
    }
  };

  // Todo: servcie workers
  setTimeout(() => {
    executeSafely(`
    //todo mock these to send messages back to the main window
    //console.log = () => {};
    //console.error = () => {};
    ${code}
    window.onmessage=(({data}) => {
      const move = doTurn(JSON.parse(data).moves)
      window.top.postMessage(JSON.stringify(move))
    })
    `);
    sendMessage(JSON.stringify(nextTurn));
  }, 1000);
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
</script>

<main>
  <textarea bind:value={code} draggable="false" />
  <div id="console" />
  <button on:click={() => {}}> RUN </button>
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
