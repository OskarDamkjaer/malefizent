<script lang="ts">
  import type { Spot, Pawn } from "./game";

  export let spot: Spot;
  export let pawn: Pawn | null;
  const { contains } = spot;
</script>

<div>
  {#if contains === "NORMAL"}
    {#if pawn}
      P
    {:else}
      O
    {/if}
  {:else if contains === "BARRICADE"}
    B
  {:else if contains === "GOAL"}
    G
  {/if}
</div>

<style>
  div {
    width: 20px;
  }
</style>
