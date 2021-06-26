<script lang="ts">
  import { playingField } from "./game";
  import Spot from "./Spot.svelte";
</script>

<main>
  {#each playingField as row}
    <div class="row">
      {#each row as spot}
        <Spot {spot} />
      {/each}
    </div>
  {/each}
</main>

<style>
  .row {
    display: flex;
  }
</style>
