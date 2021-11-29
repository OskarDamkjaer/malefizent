<script lang="ts">
  export let player: Color;
  export let expand: boolean = false;
  export let startCode: string = randomBotSource;
  import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
  import { keymap } from "@codemirror/view";
  import { javascript } from "@codemirror/lang-javascript";
  import { indentWithTab } from "@codemirror/commands";
  import { onMount } from "svelte";
  import type { Color } from "./game";
  import { loadPlayerCode, playerConstants } from "./helpers";
  import { playerStarter, randomBotSource } from "./DefaultBots";
  let expanded = expand;
  let code = startCode;

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
    ${getEditorContents() ?? code} 
    window.onmessage=(({data}) => {
      const move = doTurn(JSON.parse(data).moves)
      window.top.postMessage(JSON.stringify(move))
    })`
    );

  function setTemplate(code: string = "foo") {
    editor.setState(
      EditorState.create({
        extensions: [basicSetup, keymap.of([indentWithTab]), javascript()],
        doc: code,
      })
    );
    loadCode();
  }
  // TODO ERROR CONSOLE
</script>

<iframe
  title="codeframe"
  id={playerConstants[player].iframeId}
  src="about:blank"
  style="display: none"
/>

<span style={`display: ${expanded ? "normal" : "none"}`}>
  <!-- // sandbox="allow-scripts" -->
  <span id={playerConstants[player].editorId} />

  <button on:click={loadCode}> submit </button>
  <button on:click={() => setTemplate(playerStarter)}>reset</button>
</span>

<button on:click={() => (expanded = !expanded)}>
  {#if expanded}collapse {player}{:else}expand {player}{/if}
</button>
