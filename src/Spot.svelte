<script lang="ts">
  import type { Spot, Pawn } from "./game";

  export let spot: Spot;
  export let pawn: Pawn | null;
</script>

<div style="color: {pawn?.color || 'black'}">
  {#if pawn}
    P
  {:else if spot.contains === "NORMAL"}
    O
  {:else if spot.contains === "BARRICADE"}
    B
  {:else if spot.contains === "GOAL"}
    G
  {/if}
</div>

<style>
  div {
    width: 20px;
  }
</style>
