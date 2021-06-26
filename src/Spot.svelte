<script lang="ts">
  export let spot;
  const { contains } = spot;
</script>

<div>
  {#if contains === "NORMAL"}
    O
  {:else if contains === "BARRICADE"}
    B
  {:else if contains === "GOAL"}
    G
  {:else if contains === "PAWN"}
    <div style={`color: ${spot.currentPawn.color}`}>O</div>
  {/if}
</div>

<style>
  div {
    width: 20px;
  }
</style>
