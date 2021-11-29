<script lang="ts">
  export let player: Color;
  import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
  import { keymap } from "@codemirror/view";
  import { javascript } from "@codemirror/lang-javascript";
  import { indentWithTab } from "@codemirror/commands";
  import { onMount } from "svelte";
  import type { Color } from "./game";
  import { loadPlayerCode, playerConstants } from "./helpers";

  const code = `/* Your job is to create a function called "doTurn" that takes 
the following parameters:
 turnOptions: Turn[];
 myPawns: Pawn[];
 otherPawns: Pawn[];
 canHavebarricade: Spot[];
 hasBarricade: Spot[];
 allSpots: Spot[]

 And you need to return one of the turnOptions. If turn chosen turn
 is invalid or your function took longer than 200ms to return, a random
 turn is chosen instead. see the types at bottom (TODO at side is better)

 You are blue.
 */ 

 function doTurn(turnOptions, myPawns, otherPawns, canHaveBarricade, allSpots) {
  //console.log(turnOptions[0])
  const randomMove = turnOptions[Math.floor(Math.random() * turnOptions.length)]

  const bestMove = turnOptions.slice().sort(
    (a, b) => b.spot.goalDistance - a.spot.goalDistance
   )[0];
  return bestMove;
}
`;

  let editor: EditorView | undefined;

  onMount(() => {
    editor = new EditorView({
      state: EditorState.create({
        extensions: [basicSetup, keymap.of([indentWithTab]), javascript()],
        doc: code,
      }),
      parent: document.getElementById(playerConstants[player].editorId),
    });
    loadCode();
  });

  function getEditorContents(): string {
    return editor?.state.doc.toString() ?? "";
  }

  const loadCode = () =>
    loadPlayerCode(
      player,
      `
    //todo mock these to send messages back to the main window
    //console.log = () => {};
    //console.error = () => {};
    ${getEditorContents() ?? ""} 
    window.onmessage=(({data}) => {
      const move = doTurn(JSON.parse(data).moves)
      window.top.postMessage(JSON.stringify(move))
    })
    `
    );
</script>

<iframe
  title="codeframe"
  id={playerConstants[player].iframeId}
  src="about:blank"
/>
<!-- // sandbox="allow-scripts" -->
<span id={playerConstants[player].editorId} />

<button on:click={loadCode}> submit </button>
