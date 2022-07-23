<script lang="ts">
  export let player: Color;
  export let expand: boolean = false;
  export let startingBot: Bot = randomBot;
  import { onMount } from "svelte";
  import type { Color } from "./game";
  import { loadPlayerCode, playerConstants } from "./helpers";
  import { pickableBots, randomBot } from "./builtinBots";
  import { basicSetup  } from "codemirror";
  import {EditorState } from "@codemirror/state"
  import {EditorView, keymap} from "@codemirror/view"
  import {indentWithTab} from "@codemirror/commands"
  import { javascript } from "@codemirror/lang-javascript";
  type Bot = { name: string; author: string; code: string };

  let expanded = expand;
  let code = startingBot.code;
  let selected = startingBot.name;
  const botNames = pickableBots.map((b) => b.name);

  let editor: EditorView | undefined;

  onMount(() => {
    editor = new EditorView({
      state: EditorState.create({
        extensions: [basicSetup, keymap.of([indentWithTab]), javascript({typescript: true})],
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
${getEditorContents() ?? code} 
window.onmessage=(({data}) => {
  const move = doTurn(JSON.parse(data))
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

  function handleSubmit() {
    setTemplate(pickableBots.find((b) => b.name === selected).code);
  }
</script>

<iframe
  title="codeframe"
  id={playerConstants[player].iframeId}
  src="about:blank"
  style="display: none"
/>

<div>Players {player}</div>
<select bind:value={selected} on:change={handleSubmit}>
  {#each botNames as name}
    <option value={name}>
      {name}
    </option>
  {/each}
</select>
<span style={`display: ${expanded ? "normal" : "none"}`}>
  <!-- // sandbox="allow-scripts" -->
  <span id={playerConstants[player].editorId} />

  <button on:click={loadCode}> submit </button>
</span>

<button on:click={() => (expanded = !expanded)}>
  {#if expanded}collapse {player}{:else}expand {player}{/if}
</button>
